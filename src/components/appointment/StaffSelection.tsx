
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Staff } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface StaffSelectionProps {
  staffMembers: Staff[];
  onSelect: (staff: Staff) => void;
  selectedStaffId?: string;
}

export function StaffSelection({ staffMembers, onSelect, selectedStaffId }: StaffSelectionProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredStaff = staffMembers.filter(
    (staff) => 
      staff.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.specialization && staff.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Wybierz lekarza</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj lekarza..."
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedStaffId === staff.id ? 'bg-health-50 border-health-500' : ''
                }`}
                onClick={() => onSelect(staff)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-health-100 text-health-600">
                        {staff.first_name[0]}{staff.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{`${staff.first_name} ${staff.last_name}`}</h3>
                      {staff.specialization && (
                        <p className="text-sm text-muted-foreground">{staff.specialization}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={selectedStaffId === staff.id ? "default" : "outline"}
                    size="sm"
                    className={selectedStaffId === staff.id ? "bg-health-600 hover:bg-health-700" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(staff);
                    }}
                  >
                    Wybierz
                  </Button>
                </div>
              </div>
            ))}
            {filteredStaff.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                Nie znaleziono lekarzy
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
