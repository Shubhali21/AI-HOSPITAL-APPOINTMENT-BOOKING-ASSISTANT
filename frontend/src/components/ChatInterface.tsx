import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';
import { AppointmentCard, AppointmentComparison } from './AppointmentCard';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  appointmentData?: any;
  showAppointmentCard?: boolean;
  showComparison?: boolean;
}

interface ChatInterfaceProps {
  service: 'booking' | 'change';
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  onBack: () => void;
}

export function ChatInterface({ service, patientName, patientEmail, patientPhone, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [originalAppointment, setOriginalAppointment] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize conversation based on service type
    const initialMessage = service === 'booking' 
      ? "I'll help you book a new appointment. What type of appointment would you like to schedule? For example, you can say 'general checkup', 'specialist consultation', or 'follow-up visit'."
      : "I'll help you with your existing appointment. Could you please provide your current appointment details or tell me what changes you'd like to make?";

    setMessages([{
      id: '1',
      text: `Hello ${patientName}! ${initialMessage}`,
      isBot: true,
      timestamp: new Date()
    }]);
  }, [service, patientName]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate API call
    setTimeout(() => {
      const { response, appointmentData, showCard, showComparison } = generateBotResponse(inputText, service, patientName, patientEmail);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
        appointmentData,
        showAppointmentCard: showCard,
        showComparison
      };
      
      if (appointmentData) {
        if (service === 'booking') {
          setCurrentAppointment(appointmentData);
        } else if (service === 'change') {
          if (!originalAppointment) {
            setOriginalAppointment(appointmentData.original);
          }
          setCurrentAppointment(appointmentData.new);
        }
      }
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string, serviceType: 'booking' | 'change', patientName: string, patientEmail: string) => {
    // This would be replaced with actual API calls
    const input = userInput.toLowerCase();
    
    if (serviceType === 'booking') {
      if (input.includes('checkup') || input.includes('general')) {
        const appointmentData = {
          patientName,
          doctorName: 'Dr. Sarah Johnson',
          date: 'January 15, 2024',
          time: '10:00 AM',
          appointmentType: 'General Checkup',
          issues: userInput,
          status: 'pending' as const
        };
        
        return {
          response: "Perfect! I've found an available slot for your general checkup. This appointment is currently pending confirmation. Here are the details:",
          appointmentData,
          showCard: true,
          showComparison: false
        };
      } else if (input.includes('specialist') || input.includes('cardio') || input.includes('derma')) {
        const appointmentData = {
          patientName,
          doctorName: 'Dr. Michael Chen',
          date: 'January 18, 2024',
          time: '2:30 PM',
          appointmentType: 'Specialist Consultation',
          issues: userInput,
          status: 'pending' as const
        };
        
        return {
          response: "Excellent! I've scheduled you with our specialist. This appointment is pending confirmation. Here are your appointment details:",
          appointmentData,
          showCard: true,
          showComparison: false
        };
      } else if (input.includes('confirm') || input.includes('yes') || input.includes('book')) {
        // Update the current appointment to confirmed status
        const confirmedAppointment = currentAppointment ? {
          ...currentAppointment,
          status: 'confirmed' as const
        } : null;
        
        return {
          response: "Wonderful! Your appointment has been confirmed. You'll receive a confirmation email shortly with all the details and any preparation instructions.",
          appointmentData: confirmedAppointment,
          showCard: true,
          showComparison: false
        };
      }
      
      return {
        response: "I'd be happy to help you book that appointment. Could you please specify what type of appointment you need? For example: 'general checkup', 'specialist consultation', or describe your specific concern.",
        appointmentData: null,
        showCard: false,
        showComparison: false
      };
    } else {
      // Change appointment logic
      if (input.includes('reschedule') || input.includes('change time') || input.includes('different date')) {
        const originalAppointment = {
          patientName,
          doctorName: 'Dr. Emily Wilson',
          date: 'January 12, 2024',
          time: '9:00 AM',
          appointmentType: 'Follow-up Visit',
          issues: 'Routine follow-up for blood pressure monitoring',
          status: 'confirmed' as const
        };
        
        const newAppointment = {
          patientName,
          doctorName: 'Dr. Emily Wilson',
          date: 'January 16, 2024',
          time: '11:00 AM',
          appointmentType: 'Follow-up Visit',
          issues: 'Routine follow-up for blood pressure monitoring',
          status: 'changed' as const
        };
        
        return {
          response: "I found your existing appointment and here's what the change would look like. The new appointment will be marked as 'changed' until confirmed:",
          appointmentData: { original: originalAppointment, new: newAppointment },
          showCard: false,
          showComparison: true
        };
      } else if (input.includes('cancel')) {
        const existingAppointment = {
          patientName,
          doctorName: 'Dr. Emily Wilson',
          date: 'January 12, 2024',
          time: '9:00 AM',
          appointmentType: 'Follow-up Visit',
          issues: 'Routine follow-up for blood pressure monitoring',
          status: 'confirmed' as const
        };
        
        return {
          response: "I understand you'd like to cancel your appointment. Let me show you the appointment details first, and then I can process the cancellation.",
          appointmentData: existingAppointment,
          showCard: true,
          showComparison: false
        };
      } else if (input.includes('confirm') || input.includes('yes') || input.includes('approve')) {
        // Update the changed appointment to confirmed status
        const confirmedAppointment = currentAppointment ? {
          ...currentAppointment,
          status: 'confirmed' as const
        } : null;
        
        return {
          response: "Perfect! Your appointment changes have been confirmed. You'll receive an updated confirmation email with the new details.",
          appointmentData: confirmedAppointment,
          showCard: true,
          showComparison: false
        };
      }
      
      return {
        response: "I can help you modify your existing appointment. Would you like to reschedule to a different date/time, change the appointment type, or cancel it entirely?",
        appointmentData: null,
        showCard: false,
        showComparison: false
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {service === 'booking' ? 'Book Appointment' : 'Change Appointment'}
            </h2>
            <p className="text-sm text-gray-600">AI Assistant • Online</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>{patientName}</p>
          <p>{patientEmail}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.isBot ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.isBot && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isBot ? 'text-gray-500' : 'text-blue-100'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {/* Show appointment card for booking */}
            {message.showAppointmentCard && message.appointmentData && (
              <div className="mt-3 max-w-sm">
                <AppointmentCard
                  appointment={message.appointmentData}
                  title={message.appointmentData.status === 'confirmed' ? "Confirmed Appointment" : "Proposed Appointment"}
                  variant={message.appointmentData.status === 'confirmed' ? 'current' : 'new'}
                />
                <div className="mt-2 text-xs text-gray-500">
                  {message.appointmentData.status === 'confirmed' 
                    ? "Your appointment is now confirmed!" 
                    : "Reply with 'confirm' to book this appointment or ask for changes."
                  }
                </div>
              </div>
            )}
            
            {/* Show comparison for appointment changes */}
            {message.showComparison && message.appointmentData && (
              <div className="mt-3 max-w-2xl">
                <AppointmentComparison
                  originalAppointment={message.appointmentData.original}
                  newAppointment={message.appointmentData.new}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Reply with "confirm" to approve these changes or request different modifications.
                </div>
              </div>
            )}
            
            {!message.isBot && (
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}