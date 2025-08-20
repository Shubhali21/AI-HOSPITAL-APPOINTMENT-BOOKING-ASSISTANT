export interface PatientInfo {
  name: string;
  email: string;
  phone: string;
}

export interface AppointmentDetails {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  appointmentType: string;
  issues?: string;
  status: 'confirmed' | 'pending' | 'changed';
  appointmentId?: string;
}
export interface AppointmentRequest {
  patientInfo: PatientInfo;
  appointmentType: 'booking' | 'change';
  message: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
  data?: any;
}

// Mock API service - replace with actual API endpoints
export const appointmentApi = {
  // First API call - initial patient registration and service selection
  async registerPatient(patientInfo: PatientInfo): Promise<ApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Patient information registered successfully',
      data: {
        patientId: `PAT${Date.now()}`,
        registeredAt: new Date().toISOString()
      }
    };
  },

  // Second API call - appointment booking conversation
  async handleBookingConversation(request: AppointmentRequest): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate appointment details based on user input
    const appointmentDetails: AppointmentDetails = {
      patientName: request.patientInfo.name,
      doctorName: 'Dr. Sarah Johnson',
      date: 'January 15, 2024',
      time: '10:00 AM',
      appointmentType: 'General Checkup',
      issues: request.message,
      status: 'pending',
      appointmentId: `APT${Date.now()}`
    };

    return {
      success: true,
      message: 'I found an available appointment slot for you. This appointment is currently pending confirmation. Here are the details:',
      data: {
        appointment: appointmentDetails,
        availableSlots: [
          { date: '2024-01-15', time: '10:00', doctor: 'Dr. Johnson' },
          { date: '2024-01-16', time: '14:00', doctor: 'Dr. Chen' },
          { date: '2024-01-17', time: '09:30', doctor: 'Dr. Wilson' }
        ]
      }
    };
  },

  // Second API call - appointment change conversation
  async handleChangeConversation(request: AppointmentRequest): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock existing appointment data
    const existingAppointment: AppointmentDetails = {
      patientName: request.patientInfo.name,
      doctorName: 'Dr. Emily Wilson',
      date: 'January 12, 2024',
      time: '9:00 AM',
      appointmentType: 'Follow-up Visit',
      issues: 'Routine follow-up for blood pressure monitoring',
      status: 'confirmed',
      appointmentId: 'APT1234567890'
    };
    
    // Mock new appointment details
    const newAppointment: AppointmentDetails = {
      ...existingAppointment,
      date: 'January 16, 2024',
      time: '11:00 AM',
      status: 'changed',
      appointmentId: `APT${Date.now()}`
    };

    return {
      success: true,
      message: 'I found your existing appointment. The proposed changes will be marked as "changed" until you confirm them. Here are the current details and proposed changes:',
      data: {
        originalAppointment: existingAppointment,
        newAppointment: newAppointment,
        changeType: 'reschedule'
      }
    };
  },

  // Finalize appointment action
  async finalizeAppointment(appointmentData: any): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      message: 'Appointment confirmed! You will receive a confirmation email shortly.',
      data: {
        appointmentId: `APT${Date.now()}`,
        confirmationNumber: `CONF${Date.now().toString().slice(-6)}`
      }
    };
  }
};