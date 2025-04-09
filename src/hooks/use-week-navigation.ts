
import { useState } from 'react';
import { addDays, startOfWeek, endOfWeek } from 'date-fns';

export function useWeekNavigation() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
  
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

  // Funkcja do pobierania dat dla aktualnego tygodnia
  const getDatesForCurrentWeek = () => {
    const dates = [];
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    
    for (let i = 0; i < 5; i++) {
      dates.push(addDays(start, i));
    }
    
    return dates;
  };

  return {
    currentWeek,
    weekStart,
    weekEnd,
    changeWeek,
    goToCurrentWeek,
    getDatesForCurrentWeek
  };
}
