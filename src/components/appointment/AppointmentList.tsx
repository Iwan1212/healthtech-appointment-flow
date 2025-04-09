
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment, Patient, Service, Staff } from '@/types/supabase';

interface AppointmentListProps {
  loading: boolean;
  appointments: Appointment[];
  patients: {[key: string]: Patient};
  services: {[key: string]: Service};
  staff: {[key: string]: Staff};
}

export function AppointmentList({
  loading,
  appointments,
  patients,
  services,
  staff
}: AppointmentListProps) {
  return (
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
  );
}
