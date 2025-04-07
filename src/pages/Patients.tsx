
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, FileText, Calendar, ArrowUpDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewPatientId, setViewPatientId] = useState<number | null>(null);
  const { toast } = useToast();

  const mockPatients = [
    { 
      id: 1, 
      name: 'Jan Kowalski', 
      pesel: '80010112345', 
      phone: '601 234 567', 
      email: 'jan.kowalski@example.com', 
      lastVisit: '27.03.2023',
      nextVisit: '15.04.2023',
      insurance: true
    },
    { 
      id: 2, 
      name: 'Anna Nowak', 
      pesel: '75050587654', 
      phone: '602 345 678', 
      email: 'anna.nowak@example.com', 
      lastVisit: '02.04.2023',
      nextVisit: '30.04.2023',
      insurance: true
    },
    { 
      id: 3, 
      name: 'Piotr Wiśniewski', 
      pesel: '90121056789', 
      phone: '603 456 789', 
      email: 'piotr.wisniewski@example.com', 
      lastVisit: '05.04.2023',
      nextVisit: null,
      insurance: false
    },
    { 
      id: 4, 
      name: 'Magdalena Kowalczyk', 
      pesel: '85030234567', 
      phone: '604 567 890', 
      email: 'magdalena.kowalczyk@example.com', 
      lastVisit: '10.03.2023',
      nextVisit: '20.04.2023',
      insurance: true
    },
    { 
      id: 5, 
      name: 'Tomasz Szymański', 
      pesel: '72112243219', 
      phone: '605 678 901', 
      email: 'tomasz.szymanski@example.com', 
      lastVisit: '15.03.2023',
      nextVisit: null,
      insurance: true
    },
  ];

  const mockMedicalHistory = [
    { date: '27.03.2023', doctor: 'dr Nowak', service: 'Konsultacja', diagnosis: 'Zapalenie zatok', notes: 'Przepisano antybiotyk.' },
    { date: '15.02.2023', doctor: 'dr Kowalski', service: 'USG jamy brzusznej', diagnosis: 'Wynik prawidłowy', notes: 'Kontrola za 6 miesięcy.' },
    { date: '10.01.2023', doctor: 'dr Wójcik', service: 'Badanie krwi', diagnosis: 'Anemia', notes: 'Zalecono suplementację żelaza.' }
  ];

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.pesel.includes(searchQuery) ||
    patient.phone.includes(searchQuery) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPatient = (patientId: number) => {
    setViewPatientId(patientId);
  };

  const handleNewAppointment = (patientId: number) => {
    toast({
      title: "Nowa wizyta",
      description: `Umówienie wizyty dla pacjenta ID: ${patientId}`,
    });
  };

  const patient = mockPatients.find(p => p.id === viewPatientId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Pacjenci</h1>
          <div className="flex space-x-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Szukaj pacjenta..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-health-600 hover:bg-health-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Nowy pacjent
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lista pacjentów</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <span>Pacjent</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>PESEL</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <span>Ostatnia wizyta</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Następna wizyta</TableHead>
                  <TableHead>Ubezpieczenie</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nie znaleziono pacjentów
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.pesel}</TableCell>
                      <TableCell>
                        <div>{patient.phone}</div>
                        <div className="text-xs text-muted-foreground">{patient.email}</div>
                      </TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        {patient.nextVisit || <span className="text-muted-foreground">Brak</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={patient.insurance ? "default" : "destructive"} className={patient.insurance ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                          {patient.insurance ? "Aktywne" : "Brak"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewPatient(patient.id)}>
                            <FileText className="h-4 w-4 mr-1" />
                            Karta
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleNewAppointment(patient.id)}>
                            <Calendar className="h-4 w-4 mr-1" />
                            Wizyta
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={viewPatientId !== null} onOpenChange={(open) => !open && setViewPatientId(null)}>
        {patient && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Karta pacjenta</DialogTitle>
              <DialogDescription>
                Szczegółowe informacje o pacjencie
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informacje</TabsTrigger>
                <TabsTrigger value="history">Historia medyczna</TabsTrigger>
                <TabsTrigger value="documents">Dokumenty</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Dane osobowe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Imię i nazwisko:</dt>
                          <dd>{patient.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">PESEL:</dt>
                          <dd>{patient.pesel}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Telefon:</dt>
                          <dd>{patient.phone}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Email:</dt>
                          <dd>{patient.email}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Ubezpieczenie:</dt>
                          <dd>
                            <Badge variant={patient.insurance ? "default" : "destructive"} className={patient.insurance ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                              {patient.insurance ? "Aktywne" : "Brak"}
                            </Badge>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Informacje medyczne</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Grupa krwi:</dt>
                          <dd>A Rh+</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Alergie:</dt>
                          <dd>Penicylina</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Choroby przewlekłe:</dt>
                          <dd>Nadciśnienie</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Leki stałe:</dt>
                          <dd>Enarenal</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setViewPatientId(null)}>
                    Zamknij
                  </Button>
                  <Button className="bg-health-600 hover:bg-health-700 text-white">
                    Edytuj dane
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Lekarz</TableHead>
                      <TableHead>Usługa</TableHead>
                      <TableHead>Rozpoznanie</TableHead>
                      <TableHead>Notatki</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMedicalHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.doctor}</TableCell>
                        <TableCell>{record.service}</TableCell>
                        <TableCell>{record.diagnosis}</TableCell>
                        <TableCell>{record.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <div className="text-center py-12 text-muted-foreground">
                  Brak dokumentów
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Patients;
