import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  flashMessage!: any;
  flashMessageSucess: any;
  constructor(private auth: AuthService, private store: StoreService,
    private router: Router) { }

  ngOnInit(): void {
    this.store.getflashMessage().subscribe(res => {
      this.flashMessage = res;
    })
  }


  login(e: any) {
    const user = {
      email: this.email,
      password: this.password
    }
    e.preventDefault();
    this.auth.login(user).subscribe((res: any) =>{
      this.flashMessageSucess = res.message;
      this.flashMessage = false;
      console.log(res)
      localStorage.setItem('token', JSON.stringify(res.token))
      this.store.setIsAuthenticate(true);
      this.router.navigate(['/'])
    })
  }

}
