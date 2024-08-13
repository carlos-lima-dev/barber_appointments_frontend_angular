import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Appointment } from '../../interfaces/appointment';
import { AppointmentsService } from '../../service/appointments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit-appointment.component.html',
  styleUrls: ['./modal-edit-appointment.component.css'],
})
export class ModalEditAppointmentComponent {
  @Input() appointment: Appointment = {
    _id: '',
    time: '',
    customerName: '',
    phone: '',
    email: '',
    date: '',
    service: '',
    barber: 'Luis',
  };
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submitSuccess = new EventEmitter<void>();

  constructor(private appointmentsService: AppointmentsService) {}

  cancel(): void {
    this.close.emit();
  }

  updateAppointment(): void {
    // Assegura que o barbeiro seja sempre "Luis"
    this.appointment.barber = 'Luis';

    if (this.appointment._id) {
      this.appointmentsService.updateAppointment(this.appointment).subscribe({
        next: () => {
          this.submitSuccess.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error('Error updating appointment:', err);
        },
      });
    } else {
      console.error('Appointment ID is undefined');
    }
  }
}
