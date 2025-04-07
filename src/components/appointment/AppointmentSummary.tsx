
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Patient, Service, Staff } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MedicalCross, CreditCard, CalendarCheck, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';

interface AppointmentSummaryProps {
  patient: Patient;
  service: Service;
  staff: Staff;
  date: Date;
  startTime: string;
  endTime: string;
  onConfirm: (notes: string) => void;
  onEdit: (step: number) => void;
}

export function AppointmentSummary({
  patient,
  service,
  staff,
  date,
  startTime,
  endTime,
  onConfirm,
  onEdit
}: AppointmentSummaryProps) {
  const [notes, setNotes] = React.useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podsumowanie wizyty</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 text-health-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Dane pacjenta</h3>
                  <p className="text-sm">{`${patient.first_name} ${patient.last_name}`}</p>
                  {patient.pesel && <p className="text-sm">PESEL: {patient.pesel}</p>}
                  {patient.phone && <p className="text-sm">Tel: {patient.phone}</p>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edytuj
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <MedicalCross className="h-5 w-5 mr-2 text-health-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Usługa</h3>
                  <p className="text-sm">{service.name}</p>
                  <p className="text-sm">{service.duration} min | {service.price.toFixed(2)} zł</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edytuj
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 text-health-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Lekarz</h3>
                  <p className="text-sm">{`${staff.first_name} ${staff.last_name}`}</p>
                  {staff.specialization && <p className="text-sm">{staff.specialization}</p>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edytuj
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 text-health-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Termin</h3>
                  <p className="text-sm">{format(date, 'EEEE, d MMMM yyyy', { locale: pl })}</p>
                  <p className="text-sm">{`${startTime} - ${endTime}`}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edytuj
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Notatki do wizyty</h3>
          <Textarea
            placeholder="Opcjonalne notatki dotyczące wizyty..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-health-600 hover:bg-health-700 text-white" 
          onClick={() => onConfirm(notes)}
        >
          <CalendarCheck className="mr-2 h-5 w-5" />
          Potwierdź wizytę
        </Button>
      </CardFooter>
    </Card>
  );
}
