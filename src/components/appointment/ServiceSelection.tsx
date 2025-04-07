
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Search, Clock, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ServiceSelectionProps {
  services: Service[];
  onSelect: (service: Service) => void;
  selectedServiceId?: string;
}

export function ServiceSelection({ services, onSelect, selectedServiceId }: ServiceSelectionProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredServices = services.filter(
    (service) => service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Wybierz usługę</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj usługi..."
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedServiceId === service.id ? 'bg-health-50 border-health-500' : ''
                }`}
                onClick={() => onSelect(service)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    )}
                  </div>
                  <Button
                    variant={selectedServiceId === service.id ? "default" : "outline"}
                    size="sm"
                    className={selectedServiceId === service.id ? "bg-health-600 hover:bg-health-700" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(service);
                    }}
                  >
                    Wybierz
                  </Button>
                </div>
                <div className="flex mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center mr-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {service.price.toFixed(2)} zł
                  </div>
                </div>
              </div>
            ))}
            {filteredServices.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                Nie znaleziono usług
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
