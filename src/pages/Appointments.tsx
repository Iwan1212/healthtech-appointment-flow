
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Appointments = () => {
  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const { toast } = useToast();

  const mockAppointments = [
    { day: 'Poniedziałek', time: '9:00', patient: 'Jan Kowalski', service: 'Konsultacja', status: 'confirmed' },
    { day: 'Poniedziałek', time: '11:00', patient: 'Anna Nowak', service: 'USG', status: 'confirmed' },
    { day: 'Wtorek', time: '10:00', patient: 'Piotr Wiśniewski', service: 'Badanie krwi', status: 'pending' },
    { day: 'Środa', time: '14:00', patient: 'Marta Lis', service: 'Konsultacja', status: 'confirmed' },
    { day: 'Czwartek', time: '12:00', patient: 'Tomasz Szymański', service: 'RTG', status: 'confirmed' },
    { day: 'Piątek', time: '15:00', patient: 'Karolina Dąbrowska', service: 'Konsultacja', status: 'pending' },
  ];

  const handleBookAppointment = (day: string, time: string) => {
    toast({
      title: "Nowa wizyta",
      description: `Dodawanie wizyty na ${day}, godz. ${time}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Rejestracja</h1>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Poprzedni tydzień
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              10-16 kwietnia
            </Button>
            <Button variant="outline" size="sm">
              Następny tydzień
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button size="sm" className="bg-health-600 hover:bg-health-700 text-white">
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
              <Button size="sm" className="bg-health-600 hover:bg-health-700 text-white">
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-max">
                    <thead>
                      <tr>
                        <th className="p-2 border-b border-r font-medium text-muted-foreground text-sm text-left w-20"></th>
                        {days.map((day, i) => (
                          <th key={i} className="p-3 border-b font-medium text-center">
                            <div>{day}</div>
                            <div className="text-xs text-muted-foreground">{`${10 + i}/04`}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((time, i) => (
                        <tr key={i}>
                          <td className="p-2 border-r text-sm font-medium text-muted-foreground">{time}</td>
                          {days.map((day, j) => {
                            const appointment = mockAppointments.find(
                              (a) => a.day === day && a.time === time
                            );
                            
                            return (
                              <td key={j} className="border border-gray-100 p-1 h-16 align-top">
                                {appointment ? (
                                  <div className={`text-xs p-1 h-full rounded ${
                                    appointment.status === 'confirmed' 
                                      ? 'bg-health-100 border-l-4 border-health-500' 
                                      : 'bg-amber-50 border-l-4 border-amber-400'
                                  }`}>
                                    <div className="font-medium">{appointment.patient}</div>
                                    <div className="text-muted-foreground">{appointment.service}</div>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full h-full justify-center items-center text-muted-foreground hover:text-health-600 hover:bg-health-50"
                                    onClick={() => handleBookAppointment(day, time)}
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
                      {mockAppointments.map((appointment, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>{`${10 + days.indexOf(appointment.day)}/04/2023`}</div>
                            <div className="text-sm text-muted-foreground">{appointment.time}</div>
                          </td>
                          <td className="p-4 font-medium">{appointment.patient}</td>
                          <td className="p-4">{appointment.service}</td>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
