import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  imgLogo = '../../../../assets/img/logo.png'
  constructor() { }

  ngOnInit(): void {
  }

}
