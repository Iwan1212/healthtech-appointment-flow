
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  Banknote, 
  ArrowUpDown,
  FileText,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Payments = () => {
  const payments = [
    { 
      id: 'PAY-1234', 
      date: '07.04.2023', 
      patient: 'Jan Kowalski', 
      service: 'Konsultacja kardiologiczna', 
      amount: 200, 
      method: 'cash',
      status: 'completed',
      invoice: true
    },
    { 
      id: 'PAY-1235', 
      date: '07.04.2023', 
      patient: 'Anna Nowak', 
      service: 'USG jamy brzusznej', 
      amount: 180, 
      method: 'card',
      status: 'completed',
      invoice: true
    },
    { 
      id: 'PAY-1236', 
      date: '06.04.2023', 
      patient: 'Piotr Wiśniewski', 
      service: 'Badanie krwi', 
      amount: 120, 
      method: 'card',
      status: 'completed',
      invoice: true
    },
    { 
      id: 'PAY-1237', 
      date: '06.04.2023', 
      patient: 'Magdalena Kowalczyk', 
      service: 'Konsultacja ortopedyczna', 
      amount: 220, 
      method: 'cash',
      status: 'pending',
      invoice: false
    },
    { 
      id: 'PAY-1238', 
      date: '05.04.2023', 
      patient: 'Tomasz Szymański', 
      service: 'RTG klatki piersiowej', 
      amount: 150, 
      method: 'card',
      status: 'completed',
      invoice: true
    },
    { 
      id: 'PAY-1239', 
      date: '05.04.2023', 
      patient: 'Karolina Dąbrowska', 
      service: 'Konsultacja dermatologiczna', 
      amount: 180, 
      method: 'cash',
      status: 'refunded',
      invoice: true
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Zrealizowana</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Oczekująca</Badge>;
      case 'refunded':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Zwrócona</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch(method) {
      case 'card':
        return <CreditCard className="h-4 w-4 text-gray-500 mr-2" />;
      case 'cash':
        return <Banknote className="h-4 w-4 text-gray-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Płatności</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Szukaj płatności..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtruj
              </Button>
              <Button className="bg-health-600 hover:bg-health-700 text-white">
                <CreditCard className="mr-2 h-4 w-4" />
                Nowa płatność
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Historia płatności</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Eksportuj
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <span>ID / Data</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Pacjent</TableHead>
                  <TableHead>Usługa</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <span>Kwota</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Metoda</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Faktura</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">{payment.id}</div>
                      <div className="text-xs text-muted-foreground">{payment.date}</div>
                    </TableCell>
                    <TableCell>{payment.patient}</TableCell>
                    <TableCell>{payment.service}</TableCell>
                    <TableCell className="font-medium">{payment.amount} zł</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.method)}
                        <span>{payment.method === 'card' ? 'Karta' : 'Gotówka'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      {payment.invoice ? (
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <FileText className="h-4 w-4 mr-1" />
                          Faktura
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          Wystaw
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Akcje
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Szczegóły płatności</DropdownMenuItem>
                          <DropdownMenuItem>Wyślij potwierdzenie</DropdownMenuItem>
                          {payment.status === 'completed' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Zwrot płatności</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Dzisiejsze przychody</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3,540 zł</div>
              <p className="text-sm text-muted-foreground mt-1">z 15 płatności</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Gotówka</span>
                  <span className="font-medium">1,620 zł</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-health-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Karta</span>
                  <span className="font-medium">1,920 zł</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-medical-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Płatności w tym miesiącu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">28,450 zł</div>
              <p className="text-sm text-muted-foreground mt-1">z 142 płatności</p>
              <div className="flex items-baseline mt-2">
                <span className="text-green-600 text-sm font-medium">+12%</span>
                <span className="text-muted-foreground text-xs ml-1">vs poprzedni miesiąc</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Oczekujące płatności</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">840 zł</div>
              <p className="text-sm text-muted-foreground mt-1">z 4 płatności</p>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Zobacz szczegóły
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
