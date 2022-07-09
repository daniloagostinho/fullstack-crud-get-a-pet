import { Component, Input, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() name: any;
  @Input() text: any;
  @Input() placeholder: any;
  @Input() value: any;
  @Input() multiple: any;
  @Input() type: any;
  constructor(private store: StoreService) { }

  ngOnInit(): void {
  }
}
