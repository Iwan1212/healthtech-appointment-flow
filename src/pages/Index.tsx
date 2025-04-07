
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  TrendingUp,
  CalendarPlus,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const stats = [
    { 
      title: 'Wizyty dziś', 
      value: '24', 
      change: '+5%', 
      icon: CalendarCheck, 
      color: 'bg-health-100 text-health-700' 
    },
    { 
      title: 'Wszyscy pacjenci', 
      value: '1,284', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-medical-100 text-medical-700' 
    },
    { 
      title: 'Przychód dziś', 
      value: '3,540 zł', 
      change: '+8%', 
      icon: CreditCard, 
      color: 'bg-indigo-100 text-indigo-700' 
    },
    { 
      title: 'Nowi pacjenci', 
      value: '12', 
      change: '+24%', 
      icon: TrendingUp, 
      color: 'bg-amber-100 text-amber-700' 
    },
  ];

  const upcomingAppointments = [
    { time: '09:00', patient: 'Jan Kowalski', service: 'Konsultacja', status: 'confirmed' },
    { time: '10:30', patient: 'Anna Nowak', service: 'USG', status: 'confirmed' },
    { time: '11:45', patient: 'Piotr Wiśniewski', service: 'Badanie krwi', status: 'pending' },
    { time: '13:15', patient: 'Magdalena Kowalczyk', service: 'Konsultacja', status: 'confirmed' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex space-x-3">
            <Button asChild className="bg-health-600 hover:bg-health-700 text-white">
              <Link to="/appointments/new">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Nowa wizyta
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-medical-500 text-medical-700 hover:bg-medical-50">
              <Link to="/patients/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Nowy pacjent
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <span className="ml-2 text-xs font-medium text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Dzisiejsze wizyty</CardTitle>
              <CardDescription>
                Lista zaplanowanych wizyt na dziś
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingAppointments.map((appointment, i) => (
                  <div 
                    key={i} 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="font-medium text-gray-900 w-16">{appointment.time}</div>
                    <div className="flex-1 ml-3">
                      <div className="font-medium">{appointment.patient}</div>
                      <div className="text-sm text-gray-500">{appointment.service}</div>
                    </div>
                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                      {appointment.status === 'confirmed' ? 'Potwierdzona' : 'Oczekująca'}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="link" className="text-health-600">
                  <Link to="/appointments">Zobacz wszystkie wizyty</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Ostatnie płatności</CardTitle>
              <CardDescription>
                Najnowsze płatności w systemie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full 
                        ${i % 2 === 0 ? 'bg-health-100 text-health-700' : 'bg-medical-100 text-medical-700'}`}>
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski'][i]}</div>
                        <div className="text-sm text-gray-500">{['Konsultacja', 'USG', 'Badanie krwi'][i]}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{[150, 280, 120][i]} zł</div>
                      <div className="text-sm text-gray-500">
                        {['2 godz. temu', '5 godz. temu', 'Wczoraj'][i]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="link" className="text-health-600">
                  <Link to="/payments">Zobacz wszystkie płatności</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
