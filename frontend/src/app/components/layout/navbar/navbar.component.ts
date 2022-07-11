import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  imgLogo = '../../../../assets/img/logo.png';
  authenticate!: boolean;
  constructor(private store: StoreService, private auth: AuthService) { }

  ngOnInit(): void {
    this.store.getIsAuthenticate().subscribe(res => {
      this.authenticate = res
    })
  }

  logout() {
    this.auth.logout()
  }
}
