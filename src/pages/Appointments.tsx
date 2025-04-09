
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Appointment, Patient, Service, Staff } from '@/types/supabase';

const Appointments = () => {
  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<{[key: string]: Patient}>({});
  const [services, setServices] = useState<{[key: string]: Service}>({});
  const [staff, setStaff] = useState<{[key: string]: Staff}>({});
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));

  // Funkcja do pobierania dat dla aktualnego tygodnia
  const getDatesForCurrentWeek = () => {
    const dates = [];
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    
    for (let i = 0; i < 5; i++) {
      dates.push(addDays(start, i));
    }
    
    return dates;
  };
  
  const weekDates = getDatesForCurrentWeek();

  // Pobieranie wizyt i powiązanych danych
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
        }, {});
        
        const servicesMap = servicesData.reduce((acc, service) => {
          acc[service.id] = service;
          return acc;
        }, {});
        
        const staffMap = staffData.reduce((acc, staffMember) => {
          acc[staffMember.id] = staffMember;
          return acc;
        }, {});
        
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
  
  // Funkcja do zmiany tygodnia
  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? addDays(currentWeek, -7) 
      : addDays(currentWeek, 7);
    
    setCurrentWeek(newDate);
    setWeekStart(startOfWeek(newDate, { weekStartsOn: 1 }));
    setWeekEnd(endOfWeek(newDate, { weekStartsOn: 1 }));
  };
  
  // Funkcja do resetowania widoku do bieżącego tygodnia
  const goToCurrentWeek = () => {
    const today = new Date();
    setCurrentWeek(today);
    setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    setWeekEnd(endOfWeek(today, { weekStartsOn: 1 }));
  };

  // Funkcja pomocnicza do znajdowania wizyt dla określonego dnia i godziny
  const getAppointmentForSlot = (date: Date, timeSlot: string) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return appointments.find(appointment => 
      appointment.appointment_date === dateString && 
      appointment.start_time.substring(0, 5) === timeSlot
    );
  };

  const handleBookAppointment = (date: Date, time: string) => {
    navigate('/appointments/new');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Rejestracja</h1>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={() => changeWeek('prev')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Poprzedni tydzień
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              {format(weekStart, 'd', { locale: pl })}-{format(addDays(weekStart, 4), 'd MMMM', { locale: pl })}
            </Button>
            <Button variant="outline" size="sm" onClick={() => changeWeek('next')}>
              Następny tydzień
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button size="sm" className="bg-health-600 hover:bg-health-700 text-white" onClick={goToCurrentWeek}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Dziś
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtruj
              </Button>
              <Button 
                size="sm" 
                className="bg-health-600 hover:bg-health-700 text-white"
                onClick={() => navigate('/appointments/new')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nowa wizyta
              </Button>
            </div>
          </div>

          <TabsContent value="calendar" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Harmonogram wizyt</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-health-600 border-r-transparent"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr>
                          <th className="p-2 border-b border-r font-medium text-muted-foreground text-sm text-left w-20"></th>
                          {weekDates.map((date, i) => (
                            <th key={i} className="p-3 border-b font-medium text-center">
                              <div>{days[i]}</div>
                              <div className="text-xs text-muted-foreground">{format(date, 'dd/MM')}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((time, i) => (
                          <tr key={i}>
                            <td className="p-2 border-r text-sm font-medium text-muted-foreground">{time}</td>
                            {weekDates.map((date, j) => {
                              const appointment = getAppointmentForSlot(date, time);
                              
                              return (
                                <td key={j} className="border border-gray-100 p-1 h-16 align-top">
                                  {appointment ? (
                                    <div className={`text-xs p-1 h-full rounded ${
                                      appointment.status === 'confirmed' 
                                        ? 'bg-health-100 border-l-4 border-health-500' 
                                        : 'bg-amber-50 border-l-4 border-amber-400'
                                    }`}>
                                      <div className="font-medium">
                                        {patients[appointment.patient_id] 
                                          ? `${patients[appointment.patient_id].first_name} ${patients[appointment.patient_id].last_name}` 
                                          : 'Nieznany pacjent'}
                                      </div>
                                      <div className="text-muted-foreground">
                                        {services[appointment.service_id]?.name || 'Nieznana usługa'}
                                      </div>
                                    </div>
                                  ) : (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full h-full justify-center items-center text-muted-foreground hover:text-health-600 hover:bg-health-50"
                                      onClick={() => handleBookAppointment(date, time)}
                                    >
                                      <PlusCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle>Lista wizyt</CardTitle>
                  <div className="w-72">
                    <Input placeholder="Szukaj pacjenta..." />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-health-600 border-r-transparent"></div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <span>Data / Czas</span>
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <span>Pacjent</span>
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usługa</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Akcje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>{format(new Date(appointment.appointment_date), 'dd/MM/yyyy')}</div>
                              <div className="text-sm text-muted-foreground">{appointment.start_time.substring(0, 5)}</div>
                            </td>
                            <td className="p-4 font-medium">
                              {patients[appointment.patient_id] 
                                ? `${patients[appointment.patient_id].first_name} ${patients[appointment.patient_id].last_name}` 
                                : 'Nieznany pacjent'}
                            </td>
                            <td className="p-4">
                              {services[appointment.service_id]?.name || 'Nieznana usługa'}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${appointment.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'}`}>
                                {appointment.status === 'confirmed' ? 'Potwierdzona' : 'Oczekująca'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                  Szczegóły
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                  Anuluj
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
