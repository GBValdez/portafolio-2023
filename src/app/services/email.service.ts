import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { email } from '@interfaces/perfil.interface';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  urlBase: string = `${environment.api}`;
  constructor(private httpClient: HttpClient) {}

  sendEmail(email: email) {
    return this.httpClient.post(`${this.urlBase}/sendEmail`, email);
  }
}
