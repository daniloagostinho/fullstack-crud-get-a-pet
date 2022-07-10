import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';
import { AuthUserUtils } from 'src/app/utils/auth-user';

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
  flashMessage!: any;
  flashMessageSucess: any;
  authUserUtils!: AuthUserUtils;

  constructor(private auth: AuthService, private store: StoreService,
    private router: Router) { }

  ngOnInit(): void {
    this.store.getflashMessage().subscribe(res => {
      this.flashMessage = res;
    })
  }

  register(e: any) {
    e.preventDefault()
    const payload = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmpassword
    }

    this.auth.register(payload).subscribe((res: any) => {
      if(res) {
        this.flashMessage = false;
        this.flashMessageSucess = res.message;
        this.authUser(res)
      }
    })
  }

  authUser(data: any) {
    localStorage.setItem('token', JSON.stringify(data.token))
    this.store.setIsAuthenticate(true);
    this.router.navigate(['/'])
  }
}
