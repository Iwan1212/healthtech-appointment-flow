
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientForm } from '@/components/appointment/PatientForm';
import { ServiceSelection } from '@/components/appointment/ServiceSelection';
import { StaffSelection } from '@/components/appointment/StaffSelection';
import { DateTimeSelection } from '@/components/appointment/DateTimeSelection';
import { AppointmentSummary } from '@/components/appointment/AppointmentSummary';
import { Appointment, Patient, Service, Staff } from '@/types/supabase';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewAppointment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [existingPatients, setExistingPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients
        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('*');
        
        if (patientsError) throw patientsError;
        setExistingPatients(patientsData);
        
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*');
        
        if (servicesError) throw servicesError;
        setServices(servicesData);
        
        // Fetch staff
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('active', true);
        
        if (staffError) throw staffError;
        setStaffMembers(staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać danych. Spróbuj ponownie później.",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  const handlePatientSubmit = async (newPatient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([newPatient])
        .select()
        .single();
      
      if (error) throw error;
      
      setPatient(data);
      setCurrentStep(1);
      toast({
        title: "Sukces",
        description: "Dodano nowego pacjenta",
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać pacjenta. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExistingPatient = (selectedPatient: Patient) => {
    setPatient(selectedPatient);
    setCurrentStep(1);
  };

  const handleSelectService = (selectedService: Service) => {
    setService(selectedService);
    setCurrentStep(2);
  };

  const handleSelectStaff = (selectedStaff: Staff) => {
    setStaff(selectedStaff);
    setCurrentStep(3);
  };

  const handleSelectDateTime = (date: Date, start: string, end: string) => {
    setAppointmentDate(date);
    setStartTime(start);
    setEndTime(end);
    setCurrentStep(4);
  };

  const handleConfirmAppointment = async (notes: string) => {
    if (!patient || !service || !staff || !appointmentDate || !startTime || !endTime) {
      toast({
        title: "Błąd",
        description: "Brakuje danych do umówienia wizyty",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newAppointment = {
        patient_id: patient.id,
        service_id: service.id,
        staff_id: staff.id,
        appointment_date: appointmentDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        status: 'confirmed',
        notes: notes || null
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Wizyta potwierdzona",
        description: "Wizyta została pomyślnie umówiona",
      });
      
      // Redirect to appointments page
      navigate('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się umówić wizyty. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleCancel = () => {
    if (confirm('Czy na pewno chcesz anulować umówienie wizyty? Wszystkie wprowadzone dane zostaną utracone.')) {
      navigate('/appointments');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Nowa wizyta</h1>
          <Button variant="outline" onClick={handleCancel}>
            <CalendarX className="mr-2 h-4 w-4" />
            Anuluj
          </Button>
        </div>
        
        <div className="flex items-center mb-6">
          {[
            'Pacjent', 
            'Usługa', 
            'Lekarz', 
            'Termin', 
            'Potwierdzenie'
          ].map((step, index) => (
            <React.Fragment key={index}>
              <div 
                className={`flex items-center justify-center rounded-full w-8 h-8 ${
                  index === currentStep 
                    ? 'bg-health-600 text-white' 
                    : index < currentStep 
                      ? 'bg-health-100 text-health-600' 
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <div 
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep 
                    ? 'bg-health-600' 
                    : 'bg-gray-200'
                }`}
                style={{ display: index === 4 ? 'none' : 'block' }}
              />
            </React.Fragment>
          ))}
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex justify-center items-center p-6">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-health-600 border-r-transparent"></div>
                <p className="mt-2">Trwa przetwarzanie...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={currentStep.toString()} className="w-full">
            <TabsContent value="0" className="mt-0">
              <PatientForm 
                onSubmit={handlePatientSubmit} 
                existingPatients={existingPatients}
                onSelectExisting={handleSelectExistingPatient}
              />
            </TabsContent>
            
            <TabsContent value="1" className="mt-0">
              <ServiceSelection 
                services={services} 
                onSelect={handleSelectService}
                selectedServiceId={service?.id}
              />
            </TabsContent>
            
            <TabsContent value="2" className="mt-0">
              <StaffSelection 
                staffMembers={staffMembers} 
                onSelect={handleSelectStaff}
                selectedStaffId={staff?.id}
              />
            </TabsContent>
            
            <TabsContent value="3" className="mt-0">
              {service && (
                <DateTimeSelection 
                  serviceDuration={service.duration} 
                  onSelectDateTime={handleSelectDateTime}
                  selectedDate={appointmentDate || undefined}
                  selectedTime={startTime || undefined}
                />
              )}
            </TabsContent>
            
            <TabsContent value="4" className="mt-0">
              {patient && service && staff && appointmentDate && startTime && endTime && (
                <AppointmentSummary 
                  patient={patient}
                  service={service}
                  staff={staff}
                  date={appointmentDate}
                  startTime={startTime}
                  endTime={endTime}
                  onConfirm={handleConfirmAppointment}
                  onEdit={handleEdit}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
