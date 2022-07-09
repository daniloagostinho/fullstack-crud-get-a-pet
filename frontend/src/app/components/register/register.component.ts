import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name!: string;
  email!: string;
  phone!: string;
  password!: string;
  confirmpassword!: string;
  constructor() { }

  ngOnInit(): void {
  }

  register(e: any) {
    e.preventDefault()
    const payload = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
      confirmpassword: this.confirmpassword
    }

    console.log('payload -->> ', payload)
  }
}
