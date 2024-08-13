import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-red-button',
  standalone: true,
  imports: [],
  templateUrl: './red-button.component.html',
  styleUrl: './red-button.component.css',
})
export class RedButtonComponent {
  @Output() click = new EventEmitter<void>();

  handleClick() {
    this.click.emit();
  }
}
