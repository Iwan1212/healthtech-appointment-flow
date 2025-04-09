
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';

interface WeekNavigationProps {
  weekStart: Date;
  changeWeek: (direction: 'prev' | 'next') => void;
  goToCurrentWeek: () => void;
}

export function WeekNavigation({ weekStart, changeWeek, goToCurrentWeek }: WeekNavigationProps) {
  return (
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
  );
}
