import { Component } from '@angular/core';
import { FaceComponent } from '@components/face/face.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BtnDirective } from '@directives/btn.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { GbInputDirective } from '@directives/gb Input/gb-input.directive';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FaceComponent,
    BtnDirective,
    MatDialogModule,
    NgClass,
    GbInputDirective,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder) {}

  send(): void {}
}
