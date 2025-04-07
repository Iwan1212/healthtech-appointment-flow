
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarClock, 
  Users, 
  CreditCard, 
  ReceiptText, 
  Settings, 
  LogOut,
  Home
} from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: CalendarClock, label: 'Rejestracja', path: '/appointments' },
    { icon: Users, label: 'Pacjenci', path: '/patients' },
    { icon: CreditCard, label: 'Płatności', path: '/payments' },
    { icon: ReceiptText, label: 'Faktury', path: '/invoices' },
    { icon: Settings, label: 'Ustawienia', path: '/settings' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r">
      <div className="px-6 py-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full health-gradient flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-800">HealthTech</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-health-50 hover:text-health-700 transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button className="flex items-center w-full px-4 py-3 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          <span>Wyloguj</span>
        </button>
      </div>
    </div>
  );
};
