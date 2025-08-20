import React, { useState } from 'react';
import { PatientInfoForm } from './components/PatientInfoForm';
import { ServiceSelection } from './components/ServiceSelection';
import { ChatInterface } from './components/ChatInterface';

interface PatientInfo {
  name: string;
  email: string;
  phone: string;
}

type AppStep = 'patient-info' | 'service-selection' | 'chat';
type ServiceType = 'booking' | 'change' | null;

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('patient-info');
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);

  const handlePatientInfoSubmit = (info: PatientInfo) => {
    setPatientInfo(info);
    setCurrentStep('service-selection');
  };

  const handleServiceSelection = (service: 'booking' | 'change') => {
    setSelectedService(service);
    setCurrentStep('chat');
  };

  const handleBackToPatientInfo = () => {
    setCurrentStep('patient-info');
    setPatientInfo(null);
  };

  const handleBackToServiceSelection = () => {
    setCurrentStep('service-selection');
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            MedAssist AI
          </h1>
          <p className="text-xl text-gray-600">
            Your Intelligent Healthcare Assistant
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentStep === 'patient-info' ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentStep === 'service-selection' ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentStep === 'chat' ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto">
          {currentStep === 'patient-info' && (
            <div className="animate-fade-in">
              <PatientInfoForm onSubmit={handlePatientInfoSubmit} />
            </div>
          )}

          {currentStep === 'service-selection' && patientInfo && (
            <div className="animate-fade-in">
              <ServiceSelection
                onSelect={handleServiceSelection}
                onBack={handleBackToPatientInfo}
                patientName={patientInfo.name}
              />
            </div>
          )}

          {currentStep === 'chat' && patientInfo && selectedService && (
            <div className="animate-fade-in">
              <ChatInterface
                service={selectedService}
                patientName={patientInfo.name}
                patientEmail={patientInfo.email}
                patientPhone={patientInfo.phone}
                onBack={handleBackToServiceSelection}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 MedAssist AI. Your privacy and data security are our top priorities.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;