export interface Appointment {
  _id?: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  notes?: string;
}
