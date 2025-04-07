
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Patient } from '@/types/supabase';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface PatientFormProps {
  onSubmit: (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => void;
  existingPatients: Patient[];
  onSelectExisting: (patient: Patient) => void;
}

export function PatientForm({ onSubmit, existingPatients, onSelectExisting }: PatientFormProps) {
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const filteredPatients = existingPatients.filter(
    (patient) => 
      patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.pesel && patient.pesel.includes(searchQuery))
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const patient = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      date_of_birth: date ? format(date, 'yyyy-MM-dd') : undefined,
      pesel: formData.get('pesel') as string,
      address: formData.get('address') as string,
    };
    
    onSubmit(patient);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Dane pacjenta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Button 
              type="button" 
              variant={showSearch ? "default" : "outline"}
              onClick={() => setShowSearch(true)}
              className="mr-2"
            >
              Znajdź istniejącego
            </Button>
            <Button 
              type="button" 
              variant={!showSearch ? "default" : "outline"}
              onClick={() => setShowSearch(false)}
            >
              Dodaj nowego
            </Button>
          </div>

          {showSearch ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Szukaj pacjenta</Label>
                <Input 
                  id="search" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Nazwisko, imię lub PESEL..." 
                  className="w-full"
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectExisting(patient)}
                    >
                      <div className="font-medium">{`${patient.first_name} ${patient.last_name}`}</div>
                      <div className="text-sm text-muted-foreground">
                        {patient.pesel && `PESEL: ${patient.pesel}`}
                        {patient.phone && ` | Tel: ${patient.phone}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-muted-foreground text-center">Nie znaleziono pacjentów</div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Imię*</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Nazwisko*</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pesel">PESEL</Label>
                  <Input id="pesel" name="pesel" />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data urodzenia</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'dd.MM.yyyy') : <span>Wybierz datę</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={pl}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Adres</Label>
                <Input id="address" name="address" />
              </div>
              
              <Button type="submit" className="w-full">Dalej</Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
