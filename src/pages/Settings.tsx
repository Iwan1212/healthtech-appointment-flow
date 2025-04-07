
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Save, Upload, Building2, Clock, Users, FileText, Bell, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Ustawienia zapisane",
      description: "Zmiany zostały pomyślnie zapisane",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Ustawienia</h1>
          <Button className="bg-health-600 hover:bg-health-700 text-white" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Zapisz zmiany
          </Button>
        </div>

        <Tabs defaultValue="general">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 px-0 mb-0">
              <TabsTrigger value="general" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-health-600">
                <Building2 className="mr-2 h-4 w-4" />
                Ogólne
              </TabsTrigger>
              <TabsTrigger value="schedule" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-health-600">
                <Clock className="mr-2 h-4 w-4" />
                Grafik
              </TabsTrigger>
              <TabsTrigger value="staff" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-health-600">
                <Users className="mr-2 h-4 w-4" />
                Personel
              </TabsTrigger>
              <TabsTrigger value="docs" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-health-600">
                <FileText className="mr-2 h-4 w-4" />
                Dokumenty
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-health-600">
                <Bell className="mr-2 h-4 w-4" />
                Powiadomienia
              </TabsTrigger>
              <TabsTrigger value="integrations" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-health-600">
                <Smartphone className="mr-2 h-4 w-4" />
                Integracje
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informacje o placówce</CardTitle>
                <CardDescription>
                  Zarządzaj podstawowymi informacjami o twojej placówce medycznej
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Nazwa placówki</Label>
                    <Input id="clinicName" defaultValue="Centrum Medyczne Zdrowie" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">NIP</Label>
                    <Input id="taxId" defaultValue="123-456-78-90" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regNum">REGON</Label>
                    <Input id="regNum" defaultValue="123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" defaultValue="+48 123 456 789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="kontakt@cmzdrowie.pl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Strona internetowa</Label>
                    <Input id="website" defaultValue="www.cmzdrowie.pl" />
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea id="address" defaultValue="ul. Kwiatowa 12, 00-001 Warszawa" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo placówki</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center border">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Wgraj logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Godziny otwarcia</CardTitle>
                <CardDescription>
                  Ustaw godziny pracy placówki dla poszczególnych dni tygodnia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'].map((day, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <Switch id={`day-${i}`} defaultChecked={i < 6} />
                        <Label htmlFor={`day-${i}`} className="min-w-[120px]">{day}</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Input 
                          className="w-24" 
                          defaultValue={i < 5 ? "08:00" : i === 5 ? "09:00" : ""} 
                          disabled={i === 6}
                        />
                        <span className="flex items-center">-</span>
                        <Input 
                          className="w-24" 
                          defaultValue={i < 5 ? "18:00" : i === 5 ? "14:00" : ""} 
                          disabled={i === 6}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Ustawienia grafiku</CardTitle>
                <CardDescription>
                  Konfiguracja domyślnych wartości dla grafiku i rejestracji pacjentów
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="slotDuration">Domyślny czas trwania wizyty</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="slotDuration" type="number" defaultValue="30" className="w-24" />
                      <span>minut</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-start">Domyślna godzina rozpoczęcia</Label>
                    <Input id="schedule-start" defaultValue="08:00" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-end">Domyślna godzina zakończenia</Label>
                    <Input id="schedule-end" defaultValue="18:00" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break-duration">Domyślny czas przerwy</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="break-duration" type="number" defaultValue="15" className="w-24" />
                      <span>minut</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-2">
                  <Switch id="allow-overlap" />
                  <Label htmlFor="allow-overlap">Zezwalaj na nakładanie się wizyt</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="reminders" defaultChecked />
                  <Label htmlFor="reminders">Włącz przypomnienia o wizytach</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="online-booking" defaultChecked />
                  <Label htmlFor="online-booking">Włącz rejestrację online</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff" className="pt-4">
            <div className="text-center py-12 text-muted-foreground">
              Ta funkcjonalność będzie dostępna w następnej wersji aplikacji.
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="pt-4">
            <div className="text-center py-12 text-muted-foreground">
              Ta funkcjonalność będzie dostępna w następnej wersji aplikacji.
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="pt-4">
            <div className="text-center py-12 text-muted-foreground">
              Ta funkcjonalność będzie dostępna w następnej wersji aplikacji.
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="pt-4">
            <div className="text-center py-12 text-muted-foreground">
              Ta funkcjonalność będzie dostępna w następnej wersji aplikacji.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
