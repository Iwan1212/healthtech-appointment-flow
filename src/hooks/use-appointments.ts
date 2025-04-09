
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { Appointment, Patient, Service, Staff } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export function useAppointments(weekStart: Date) {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<{[key: string]: Patient}>({});
  const [services, setServices] = useState<{[key: string]: Service}>({});
  const [staff, setStaff] = useState<{[key: string]: Staff}>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointmentsData = async () => {
      setLoading(true);
      try {
        // Pobierz daty początku i końca tygodnia
        const start = format(weekStart, 'yyyy-MM-dd');
        const end = format(addDays(weekStart, 4), 'yyyy-MM-dd');
        
        // Pobierz wizyty z danego zakresu dat
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .gte('appointment_date', start)
          .lte('appointment_date', end);
        
        if (appointmentsError) throw appointmentsError;
        
        // Pobierz pacjentów
        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('*');
        
        if (patientsError) throw patientsError;
        
        // Pobierz usługi
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*');
        
        if (servicesError) throw servicesError;
        
        // Pobierz personel
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*');
        
        if (staffError) throw staffError;
        
        // Zamień dane na obiekty z kluczami ID dla łatwego dostępu
        const patientsMap = patientsData.reduce((acc, patient) => {
          acc[patient.id] = patient;
          return acc;
        }, {} as {[key: string]: Patient});
        
        const servicesMap = servicesData.reduce((acc, service) => {
          acc[service.id] = service;
          return acc;
        }, {} as {[key: string]: Service});
        
        const staffMap = staffData.reduce((acc, staffMember) => {
          acc[staffMember.id] = staffMember;
          return acc;
        }, {} as {[key: string]: Staff});
        
        setAppointments(appointmentsData || []);
        setPatients(patientsMap);
        setServices(servicesMap);
        setStaff(staffMap);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać danych. Spróbuj ponownie później.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsData();
  }, [toast, weekStart]);

  return { loading, appointments, patients, services, staff };
}
