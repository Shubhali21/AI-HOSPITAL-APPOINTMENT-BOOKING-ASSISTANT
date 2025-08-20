import { useState } from 'react';
import { appointmentApi, PatientInfo } from '../services/appointmentApi';

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (text: string, isBot: boolean = false): string => {
    const id = Date.now().toString();
    const message: Message = {
      id,
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    return id;
  };

  const sendMessage = async (
    text: string,
    patientInfo: PatientInfo,
    serviceType: 'booking' | 'change'
  ) => {
    // Add user message
    addMessage(text, false);
    setIsLoading(true);

    try {
      // Call appropriate API based on service type
      const response = serviceType === 'booking' 
        ? await appointmentApi.handleBookingConversation({
            patientInfo,
            appointmentType: serviceType,
            message: text
          })
        : await appointmentApi.handleChangeConversation({
            patientInfo,
            appointmentType: serviceType,
            message: text
          });

      // Add bot response
      if (response.success) {
        addMessage(response.message, true);
      } else {
        addMessage('I apologize, but I encountered an error. Please try again.', true);
      }
    } catch (error) {
      addMessage('I\'m sorry, I\'m having trouble connecting right now. Please try again later.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    clearMessages
  };
}