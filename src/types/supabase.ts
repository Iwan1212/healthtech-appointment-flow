
export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  pesel?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export type Service = {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export type Staff = {
  id: string;
  first_name: string;
  last_name: string;
  specialization?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type Appointment = {
  id: string;
  patient_id: string;
  staff_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
