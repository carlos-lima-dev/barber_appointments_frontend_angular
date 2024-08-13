import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Appointment } from '../../interfaces/appointment';
import { AppointmentsService } from '../../service/appointments.service';
import { FormsModule } from '@angular/forms';
import { SidebarFormComponent } from '../../components/sidebar-form/sidebar-form.component';
import { ModalEditAppointmentComponent } from '../../components/modal-edit-appointment/modal-edit-appointment.component';
import { RedButtonComponent } from '../../components/red-button/red-button.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarFormComponent,
    ModalEditAppointmentComponent,
    RedButtonComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  user: any;
  appointments: Appointment[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  showEditForm: boolean = false;
  showSidebar: boolean = false;
  today = new Date().toISOString().split('T')[0];
  selectedAppointment: Appointment = {
    _id: '',
    time: '',
    customerName: '',
    phone: '',
    email: '',
    date: '',
    service: '',
    barber: '',
  };
  availableTimes: string[] = [
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.fetchAppointments(this.selectedDate);
    try {
      this.user = this.authService.getUser();
    } catch (error) {
      console.error('Error fetching user:', error);
      this.router.navigate(['/login']);
    }
  }

  fetchAppointments(date: string): void {
    this.appointmentsService.getDailyAppointments(date).subscribe({
      next: (data) => {
        this.appointments = data;
        console.log('Appointments fetched:', this.appointments);
      },
      error: (err) => {
        console.error('Error fetching appointments:', err);
      },
    });
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.fetchAppointments(this.selectedDate);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  deleteAppointment(appointmentId: string | undefined): void {
    if (appointmentId) {
      if (confirm('Are you sure you want to delete this appointment?')) {
        this.appointmentsService.deleteAppointment(appointmentId).subscribe({
          next: () => {
            this.appointments = this.appointments.filter(
              (app) => app._id !== appointmentId
            );
            alert('Appointment deleted successfully.');
          },
          error: (err: any) => {
            console.error('Error deleting appointment:', err);
            alert('Error deleting appointment.');
          },
        });
      }
    } else {
      console.error('Appointment ID is undefined');
      alert('Error: Appointment ID is missing.');
    }
  }

  openEditForm(appointment: Appointment): void {
    this.selectedAppointment = { ...appointment };
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
  }

  updateAppointment(): void {
    if (this.selectedAppointment._id) {
      this.appointmentsService
        .updateAppointment(this.selectedAppointment)
        .subscribe({
          next: (updatedAppointment) => {
            const index = this.appointments.findIndex(
              (app) => app._id === updatedAppointment._id
            );
            if (index !== -1) {
              this.appointments[index] = updatedAppointment;
            }
            this.showEditForm = false;
            alert('Appointment updated successfully.');
            this.fetchAppointments(this.selectedDate);
          },
          error: (err) => {
            console.error('Error updating appointment:', err);
            alert('Error updating appointment.');
          },
        });
    } else {
      console.error('Appointment ID is undefined');
      alert('Error: Appointment ID is missing.');
    }
  }

  openSidebar(): void {
    this.showSidebar = true;
  }

  closeSidebar(): void {
    this.showSidebar = false;
  }

  onSubmitSuccess(): void {
    this.fetchAppointments(this.selectedDate);
    this.closeSidebar();
  }

  goToNewAppointment(): void {
    this.openSidebar();
  }

  getAppointmentByTime(time: string): Appointment | undefined {
    return this.appointments.find((appointment) => appointment.time === time);
  }
}
