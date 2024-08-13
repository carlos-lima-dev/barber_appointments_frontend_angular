import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarFormComponent } from '../../components/sidebar-form/sidebar-form.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarFormComponent,
    ConfirmationModalComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  displayForm = false;
  showConfirmation = true;
  availableTimes = [
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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.route.queryParams.subscribe((params) => {
      this.displayForm = params['sidebar'] === 'open';
    });
  }

  showAppointment() {
    this.displayForm = true;
  }

  closeModal() {
    this.displayForm = false;
  }

  onSubmitSuccess() {
    this.displayForm = false;
    this.showConfirmation = true;
    this.router.navigate(['/']);
  }
  closeConfirmation() {
    this.showConfirmation = false;
  }
}
