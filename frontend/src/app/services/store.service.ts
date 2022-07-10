import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  flashMessage = new BehaviorSubject<any>(null);
  isAuthenticate  = new BehaviorSubject<any>(false)
  constructor() { }

  setflashMessage(message: any) {
    this.flashMessage.next(message)
  }

  getflashMessage() {
    return this.flashMessage.asObservable();
  }

  setIsAuthenticate(data: any) {
    this.isAuthenticate.next(data)
  }

  getIsAuthenticate() {
    return this.isAuthenticate.asObservable();
  }
}
