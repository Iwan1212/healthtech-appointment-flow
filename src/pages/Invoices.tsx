
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, FileText, Send, FileCog, Printer, Eye, ArrowUpDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Invoices = () => {
  const { toast } = useToast();

  const invoices = [
    { 
      id: 'FV/2023/04/001', 
      date: '07.04.2023', 
      patient: 'Jan Kowalski', 
      services: ['Konsultacja kardiologiczna'], 
      amount: 200, 
      status: 'paid'
    },
    { 
      id: 'FV/2023/04/002', 
      date: '07.04.2023', 
      patient: 'Anna Nowak', 
      services: ['USG jamy brzusznej'], 
      amount: 180, 
      status: 'paid'
    },
    { 
      id: 'FV/2023/04/003', 
      date: '06.04.2023', 
      patient: 'Piotr Wiśniewski', 
      services: ['Badanie krwi'], 
      amount: 120, 
      status: 'paid'
    },
    { 
      id: 'FV/2023/04/004', 
      date: '05.04.2023', 
      patient: 'Tomasz Szymański', 
      services: ['RTG klatki piersiowej'], 
      amount: 150, 
      status: 'paid'
    },
    { 
      id: 'FV/2023/04/005', 
      date: '05.04.2023', 
      patient: 'Karolina Dąbrowska', 
      services: ['Konsultacja dermatologiczna'], 
      amount: 180, 
      status: 'unpaid'
    },
    { 
      id: 'PAR/2023/04/001', 
      date: '04.04.2023', 
      patient: 'Marta Lis', 
      services: ['Badanie krwi', 'EKG'], 
      amount: 240, 
      status: 'paid',
      type: 'receipt'
    },
  ];
  
  const renderStatus = (status: string) => {
    switch(status) {
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Opłacona</span>;
      case 'unpaid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Nieopłacona</span>;
      default:
        return status;
    }
  };

  const handlePrint = (id: string) => {
    toast({
      title: "Drukowanie dokumentu",
      description: `Przygotowywanie do druku dokumentu ${id}`,
    });
  };

  const handleSend = (id: string) => {
    toast({
      title: "Wysyłanie dokumentu",
      description: `Wysyłanie dokumentu ${id} do pacjenta`,
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "Podgląd dokumentu",
      description: `Otwieranie podglądu dokumentu ${id}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Faktury i paragony</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Szukaj dokumentów..." className="pl-10" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Eksportuj
              </Button>
              <Button className="bg-health-600 hover:bg-health-700 text-white">
                <FileText className="mr-2 h-4 w-4" />
                Nowa faktura
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Wszystkie</TabsTrigger>
            <TabsTrigger value="invoices">Faktury</TabsTrigger>
            <TabsTrigger value="receipts">Paragony</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Lista dokumentów</CardTitle>
            </CardHeader>
            <CardContent>
              <TabsContent value="all" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Numer / Data</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Pacjent</TableHead>
                      <TableHead>Usługi</TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Kwota</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-xs text-muted-foreground">{invoice.date}</div>
                        </TableCell>
                        <TableCell>{invoice.patient}</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside text-sm">
                            {invoice.services.map((service, i) => (
                              <li key={i}>{service}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell className="font-medium">{invoice.amount} zł</TableCell>
                        <TableCell>{renderStatus(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleView(invoice.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handlePrint(invoice.id)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleSend(invoice.id)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="invoices" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numer / Data</TableHead>
                      <TableHead>Pacjent</TableHead>
                      <TableHead>Usługi</TableHead>
                      <TableHead>Kwota</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices
                      .filter(inv => !inv.type || inv.type !== 'receipt')
                      .map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <div className="font-medium">{invoice.id}</div>
                            <div className="text-xs text-muted-foreground">{invoice.date}</div>
                          </TableCell>
                          <TableCell>{invoice.patient}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside text-sm">
                              {invoice.services.map((service, i) => (
                                <li key={i}>{service}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell className="font-medium">{invoice.amount} zł</TableCell>
                          <TableCell>{renderStatus(invoice.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleView(invoice.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handlePrint(invoice.id)}>
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleSend(invoice.id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="receipts" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numer / Data</TableHead>
                      <TableHead>Pacjent</TableHead>
                      <TableHead>Usługi</TableHead>
                      <TableHead>Kwota</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices
                      .filter(inv => inv.type === 'receipt')
                      .map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <div className="font-medium">{invoice.id}</div>
                            <div className="text-xs text-muted-foreground">{invoice.date}</div>
                          </TableCell>
                          <TableCell>{invoice.patient}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside text-sm">
                              {invoice.services.map((service, i) => (
                                <li key={i}>{service}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell className="font-medium">{invoice.amount} zł</TableCell>
                          <TableCell>{renderStatus(invoice.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleView(invoice.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handlePrint(invoice.id)}>
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleSend(invoice.id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Podsumowanie dokumentów</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Faktury w tym miesiącu</div>
                  <div className="text-2xl font-bold mt-1">32</div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-green-600 text-xs font-medium">+8%</span>
                    <span className="text-muted-foreground text-xs ml-1">vs poprzedni miesiąc</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Paragony w tym miesiącu</div>
                  <div className="text-2xl font-bold mt-1">67</div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-green-600 text-xs font-medium">+12%</span>
                    <span className="text-muted-foreground text-xs ml-1">vs poprzedni miesiąc</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Wartość faktur</div>
                  <div className="text-2xl font-bold mt-1">16,230 zł</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Wartość paragonów</div>
                  <div className="text-2xl font-bold mt-1">8,450 zł</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Szablony dokumentów</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <FileCog className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="font-medium">Faktura standardowa</div>
                      <div className="text-xs text-muted-foreground">Podstawowy szablon faktury</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edytuj</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <FileCog className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="font-medium">Paragon fiskalny</div>
                      <div className="text-xs text-muted-foreground">Standardowy paragon</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edytuj</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <FileCog className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="font-medium">Faktura proforma</div>
                      <div className="text-xs text-muted-foreground">Szablon faktury zaliczkowej</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edytuj</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
