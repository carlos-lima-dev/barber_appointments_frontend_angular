import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://barber-api-t60m.onrender.com/auth';
  private token: string | null = null;

  constructor(private http: HttpClient) {}
  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ user: any; accessToken: string }>(
        `${this.apiUrl}/login`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (response && response.accessToken) {
            this.token = response.accessToken;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        })
      );
  }

  isLoggedIn(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }
    return !!localStorage.getItem('authToken');
  }

  getToken(): string {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token available');
    }
    return token;
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('No user information available');
    }
    return JSON.parse(user);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}
