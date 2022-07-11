import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,
    private store: StoreService,
    private router: Router) { }

  register(user: any) {
      return this.http.post(`${environment.BASE_URL}users/register`, user)
  }

  logout() {
    this.store.setIsAuthenticate(false)
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }

  login(user: any) {
    return this.http.post(`${environment.BASE_URL}users/login`, user)
  }
}
