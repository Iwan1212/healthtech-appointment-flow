
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Appointment, Patient, Service, Staff } from '@/types/supabase';

interface AppointmentCalendarProps {
  loading: boolean;
  appointments: Appointment[];
  patients: {[key: string]: Patient};
  services: {[key: string]: Service};
  staff: {[key: string]: Staff};
  weekDates: Date[];
  days: string[];
  timeSlots: string[];
  handleBookAppointment: (date: Date, time: string) => void;
}

export function AppointmentCalendar({
  loading,
  appointments,
  patients,
  services,
  staff,
  weekDates,
  days,
  timeSlots,
  handleBookAppointment
}: AppointmentCalendarProps) {
  // Helper function to find appointments for a specific day and time
  const getAppointmentForSlot = (date: Date, timeSlot: string) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return appointments.find(appointment => 
      appointment.appointment_date === dateString && 
      appointment.start_time.substring(0, 5) === timeSlot
    );
  };

  return (
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
  );
}
