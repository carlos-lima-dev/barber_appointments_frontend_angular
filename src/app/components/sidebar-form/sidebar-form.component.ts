import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AppointmentsService } from '../../service/appointments.service';
import { Appointment } from '../../interfaces/appointment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sidebar-form.component.html',
  styleUrls: ['./sidebar-form.component.css'],
})
export class SidebarFormComponent implements OnInit {
  @Input() availableTimes: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submitSuccess = new EventEmitter<void>();

  appointmentForm: FormGroup;
  today = new Date().toISOString().split('T')[0];
  filteredTimes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentsService
  ) {
    this.appointmentForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      date: ['', [Validators.required, this.forbidSundayAndMonday()]], // Validador personalizado para domingos e segundas
      time: ['', Validators.required],
      service: ['', Validators.required],
      barber: ['Luis'],
    });
  }

  ngOnInit(): void {
    this.appointmentForm.get('date')?.valueChanges.subscribe((date) => {
      if (date) {
        this.loadAvailableTimes(date);
      }
    });
  }

  loadAvailableTimes(date: string): void {
    if (this.isSundayOrMonday(date)) {
      this.filteredTimes = []; // No times available on Sundays or Mondays
    } else {
      this.appointmentService.getDailyAppointments(date).subscribe(
        (appointments) => {
          const bookedTimes = appointments.map((app) => app.time);
          this.filteredTimes = this.availableTimes.filter(
            (time) => !bookedTimes.includes(time)
          );
          this.appointmentForm.get('time')?.setValue(''); // Reset time selection when date changes
        },
        (error) => {
          console.error('Error fetching appointments', error);
          this.filteredTimes = this.availableTimes; // Fallback to showing all available times
        }
      );
    }
  }

  handleSubmit() {
    if (this.appointmentForm.valid) {
      const newAppointment: Appointment = this.appointmentForm.value;
      this.appointmentService.bookAppointment(newAppointment).subscribe(
        (response) => {
          console.log('Appointment booked successfully', response);
          this.close.emit();
          this.submitSuccess.emit();
        },
        (error) => {
          console.error('Error booking appointment', error);
        }
      );
    }
  }

  handleCancel() {
    this.close.emit();
  }

  isSundayOrMonday(date: string): boolean {
    const day = new Date(date).getDay();
    return day === 0 || day === 1; // Domingo = 0, Segunda = 1
  }

  // Validador personalizado para impedir agendamentos aos domingos ou segundas-feiras
  forbidSundayAndMonday() {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = control.value;
      if (date && this.isSundayOrMonday(date)) {
        return { forbiddenDate: true }; // Retorna um erro se for domingo ou segunda
      }
      return null; // Retorna null se não houver erro
    };
  }
}
