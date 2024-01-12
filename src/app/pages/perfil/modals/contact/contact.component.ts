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
import { EmailService } from '@services/email.service';
import { email } from '@interfaces/perfil.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

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
  gmailGB: string = 'gabrielbenjaminvaldezdeleon@gmail.com';
  telGB: string = '5850-3857';
  textSend: string = 'Enviar';
  linkedinGB: string = 'in/gb-valdez';
  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private emailSvc: EmailService,
    private toastCtr: MatSnackBar,
    private clipboard: Clipboard
  ) {}

  copyToClipboard(text: string, type: string): void {
    this.clipboard.copy(text);
    this.toastCtr.open(`Se copio el ${type} al portapapeles`, 'Cerrar', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  send(): void {
    if (this.form.valid) {
      this.textSend = 'Enviando...';
      const name: string = this.form.value.name!;
      const email: string = this.form.value.email!;
      const message: string = this.form.value.message!;
      this.form.disable();
      setTimeout(() => {
        this.textSend = 'Enviado';
      }, 2000);
      this.emailSvc
        .sendEmail({
          name,
          email,
          message,
        })
        .subscribe((res) => {
          this.textSend = 'Enviado';
          this.toastCtr.open('Mensaje enviado con éxito', 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
        });
    }
  }
}
