import React from 'react';
import { Calendar, Clock, User, Stethoscope, FileText, ArrowRight } from 'lucide-react';

interface AppointmentDetails {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  appointmentType: string;
  issues?: string;
  status?: 'confirmed' | 'pending' | 'changed';
}

interface AppointmentCardProps {
  appointment: AppointmentDetails;
  title: string;
  variant?: 'current' | 'new' | 'comparison';
  showChanges?: boolean;
}

export function AppointmentCard({ appointment, title, variant = 'current', showChanges = false }: AppointmentCardProps) {
  const getCardStyles = () => {
    switch (variant) {
      case 'new':
        return 'border-green-200 bg-green-50';
      case 'comparison':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'changed':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      default:
        return 'text-blue-700 bg-blue-100 border-blue-200';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-4 ${getCardStyles()}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        {appointment.status && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            <strong>Patient:</strong> {appointment.patientName}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            <strong>Doctor:</strong> {appointment.doctorName}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            <strong>Date:</strong> {appointment.date}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            <strong>Time:</strong> {appointment.time}
          </span>
        </div>
        
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
          <span className="text-sm text-gray-700">
            <strong>Type:</strong> {appointment.appointmentType}
          </span>
        </div>
        
        {appointment.issues && (
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <strong>Issues/Concerns:</strong>
              <p className="mt-1 text-gray-600 italic">{appointment.issues}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AppointmentComparisonProps {
  originalAppointment: AppointmentDetails;
  newAppointment: AppointmentDetails;
}

export function AppointmentComparison({ originalAppointment, newAppointment }: AppointmentComparisonProps) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <AppointmentCard
          appointment={originalAppointment}
          title="Current Appointment"
          variant="comparison"
        />
        
        <div className="flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>
        
        <AppointmentCard
          appointment={newAppointment}
          title="Requested Changes"
          variant="new"
        />
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Changes are pending confirmation. You will receive an email once the changes are processed.
        </p>
      </div>
    </div>
  );
}