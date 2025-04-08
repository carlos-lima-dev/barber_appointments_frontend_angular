import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../interfaces/appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private apiUrl = 'https://https://bookingapi-nqqx.onrender.com';

  constructor(private http: HttpClient) {}

  getDailyAppointments(date: string): Observable<Appointment[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Appointment[]>(`${this.apiUrl}/by-date`, { params });
  }

  bookAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(this.apiUrl/appointments, appointment);
  }

  deleteAppointment(appointmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.apiUrl}/${appointment._id}`,
      appointment
    );
  }
}
