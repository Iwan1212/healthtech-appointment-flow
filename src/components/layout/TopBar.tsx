
import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="hidden md:flex items-center flex-1 mx-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Szukaj..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-health-100 flex items-center justify-center">
              <span className="text-health-600 font-semibold">DR</span>
            </div>
            <span className="ml-2 font-medium text-sm hidden md:inline-block">Dr. Kowalski</span>
          </div>
        </div>
      </div>
    </header>
  );
};
