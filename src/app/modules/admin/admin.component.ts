import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `
    <router-outlet name='view'></router-outlet>
  `,
  styles: [

  ]
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
