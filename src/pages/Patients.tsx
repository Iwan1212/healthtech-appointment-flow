
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, FileText, Calendar, ArrowUpDown, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/supabase';

const Patients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewPatientId, setViewPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('last_name', { ascending: true });
        
        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać listy pacjentów',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  const mockMedicalHistory = [
    { date: '27.03.2023', doctor: 'dr Nowak', service: 'Konsultacja', diagnosis: 'Zapalenie zatok', notes: 'Przepisano antybiotyk.' },
    { date: '15.02.2023', doctor: 'dr Kowalski', service: 'USG jamy brzusznej', diagnosis: 'Wynik prawidłowy', notes: 'Kontrola za 6 miesięcy.' },
    { date: '10.01.2023', doctor: 'dr Wójcik', service: 'Badanie krwi', diagnosis: 'Anemia', notes: 'Zalecono suplementację żelaza.' }
  ];

  const filteredPatients = patients.filter(patient => 
    (patient.first_name + ' ' + patient.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.pesel && patient.pesel.includes(searchQuery)) ||
    (patient.phone && patient.phone.includes(searchQuery)) ||
    (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewPatient = (patientId: string) => {
    setViewPatientId(patientId);
  };

  const handleNewAppointment = (patientId: string) => {
    toast({
      title: "Nowa wizyta",
      description: `Umówienie wizyty dla pacjenta ID: ${patientId}`,
    });
    navigate('/appointments/new');
  };

  const handleAddPatient = () => {
    navigate('/patients/new');
  };

  const patient = patients.find(p => p.id === viewPatientId);

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
            <Button 
              className="bg-health-600 hover:bg-health-700 text-white"
              onClick={handleAddPatient}
            >
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
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-health-600" />
              </div>
            ) : (
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
                        <span>Data urodzenia</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nie znaleziono pacjentów
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.first_name} {patient.last_name}</TableCell>
                        <TableCell>{patient.pesel || "-"}</TableCell>
                        <TableCell>
                          <div>{patient.phone || "-"}</div>
                          <div className="text-xs text-muted-foreground">{patient.email || "-"}</div>
                        </TableCell>
                        <TableCell>{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('pl-PL') : "-"}</TableCell>
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
            )}
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
                          <dd>{patient.first_name} {patient.last_name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">PESEL:</dt>
                          <dd>{patient.pesel || "-"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Telefon:</dt>
                          <dd>{patient.phone || "-"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Email:</dt>
                          <dd>{patient.email || "-"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Data urodzenia:</dt>
                          <dd>{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('pl-PL') : "-"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Adres:</dt>
                          <dd>{patient.address || "-"}</dd>
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
                          <dd>Brak danych</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Alergie:</dt>
                          <dd>Brak danych</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Choroby przewlekłe:</dt>
                          <dd>Brak danych</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-muted-foreground">Leki stałe:</dt>
                          <dd>Brak danych</dd>
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
