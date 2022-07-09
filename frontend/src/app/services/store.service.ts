import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  formPayload = new BehaviorSubject<Object>({});
  constructor() { }

  setformPayload(data: any) {
    this.formPayload.next({...data})
  }

  getFormPayload() {
    return this.formPayload.asObservable();
  }
}
