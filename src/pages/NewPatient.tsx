
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const patientFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "Imię musi zawierać co najmniej 2 znaki.",
  }),
  last_name: z.string().min(2, {
    message: "Nazwisko musi zawierać co najmniej 2 znaki.",
  }),
  date_of_birth: z.date().optional(),
  pesel: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Nieprawidłowy adres email." }).optional().or(z.literal('')),
  address: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

const NewPatient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      pesel: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    try {
      // Format date to string for Supabase
      const formattedData = {
        ...data,
        date_of_birth: data.date_of_birth ? format(data.date_of_birth, 'yyyy-MM-dd') : null,
      };

      const { data: patient, error } = await supabase
        .from('patients')
        .insert(formattedData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Pacjent dodany",
        description: `Pomyślnie dodano pacjenta ${data.first_name} ${data.last_name}`,
      });
      navigate("/patients");
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać pacjenta. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/patients')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Powrót
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Nowy pacjent</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dane pacjenta</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imię*</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwisko*</FormLabel>
                        <FormControl>
                          <Input placeholder="Kowalski" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pesel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PESEL</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 80010112345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data urodzenia</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, 'dd.MM.yyyy')
                                ) : (
                                  <span>Wybierz datę</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              locale={pl}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 601 234 567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="np. jan.kowalski@example.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input placeholder="np. ul. Marszałkowska 1, 00-001 Warszawa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-health-600 hover:bg-health-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Dodaj pacjenta
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewPatient;
