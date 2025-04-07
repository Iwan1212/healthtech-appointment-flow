
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { pl } from 'date-fns/locale';
import { format, addDays, setHours, setMinutes, isSameDay } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DateTimeSelectionProps {
  serviceDuration: number;
  onSelectDateTime: (date: Date, startTime: string, endTime: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export function DateTimeSelection({ 
  serviceDuration, 
  onSelectDateTime, 
  selectedDate, 
  selectedTime 
}: DateTimeSelectionProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  
  // Godziny pracy od 8:00 do 18:00
  const workingHours = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (date) {
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = time;
      
      // Obliczanie czasu zakończenia
      const startDate = setHours(setMinutes(new Date(date), minutes), hours);
      const endDate = new Date(startDate.getTime() + serviceDuration * 60 * 1000);
      const endTime = format(endDate, 'HH:mm');
      
      onSelectDateTime(date, startTime, endTime);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Wybierz termin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Button variant="outline" size="sm" onClick={() => setDate(addDays(date || new Date(), -7))}>
                <ChevronLeft className="h-4 w-4" />
                Poprzedni tydzień
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDate(addDays(date || new Date(), 7))}>
                Następny tydzień
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={pl}
              className="rounded-md border"
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Dostępne godziny {date && `(${format(date, 'dd.MM.yyyy')})`}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {workingHours.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time && selectedDate && date && isSameDay(selectedDate, date) ? "default" : "outline"}
                  className={
                    selectedTime === time && selectedDate && date && isSameDay(selectedDate, date)
                      ? "bg-health-600 hover:bg-health-700"
                      : ""
                  }
                  size="sm"
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
