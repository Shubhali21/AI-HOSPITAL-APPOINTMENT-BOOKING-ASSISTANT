import React from 'react';
import { Calendar, RefreshCw, ArrowLeft } from 'lucide-react';

interface ServiceSelectionProps {
  onSelect: (service: 'booking' | 'change') => void;
  onBack: () => void;
  patientName: string;
}

export function ServiceSelection({ onSelect, onBack, patientName }: ServiceSelectionProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Hello {patientName}! How can I help you today?
        </h2>
        <p className="text-gray-600">Please select the service you need</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => onSelect('booking')}
          className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group text-left"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Book New Appointment</h3>
          <p className="text-gray-600">Schedule a new appointment with one of our healthcare professionals</p>
        </button>

        <button
          onClick={() => onSelect('change')}
          className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group text-left"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <RefreshCw className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Change Existing Appointment</h3>
          <p className="text-gray-600">Modify, reschedule, or cancel your existing appointment</p>
        </button>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back
      </button>
    </div>
  );
}