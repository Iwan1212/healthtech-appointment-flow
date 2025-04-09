
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Filter, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WeekNavigation } from '@/components/appointment/WeekNavigation';
import { AppointmentCalendar } from '@/components/appointment/AppointmentCalendar';
import { AppointmentList } from '@/components/appointment/AppointmentList';
import { useAppointments } from '@/hooks/use-appointments';
import { useWeekNavigation } from '@/hooks/use-week-navigation';

const Appointments = () => {
  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const navigate = useNavigate();
  
  const {
    weekStart,
    changeWeek,
    goToCurrentWeek,
    getDatesForCurrentWeek
  } = useWeekNavigation();
  
  const weekDates = getDatesForCurrentWeek();
  
  const { loading, appointments, patients, services, staff } = useAppointments(weekStart);

  const handleBookAppointment = (date: Date, time: string) => {
    navigate('/appointments/new');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Rejestracja</h1>
          <WeekNavigation
            weekStart={weekStart}
            changeWeek={changeWeek}
            goToCurrentWeek={goToCurrentWeek}
          />
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
            <AppointmentCalendar
              loading={loading}
              appointments={appointments}
              patients={patients}
              services={services}
              staff={staff}
              weekDates={weekDates}
              days={days}
              timeSlots={timeSlots}
              handleBookAppointment={handleBookAppointment}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <AppointmentList
              loading={loading}
              appointments={appointments}
              patients={patients}
              services={services}
              staff={staff}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
