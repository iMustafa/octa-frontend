import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../globals/services/authorization.service';

@Component({
  selector: 'admin-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  constructor(private _auth: AuthorizationService) {

  }

  ngOnInit() {  }

  public menuItems: any = [
    {routerLink: [{'outlets': {'manage': ['packages']}}], text: 'Packages', icon: 'call_to_action'},
    {routerLink: [{'outlets': {'manage': ['pages']}}], text: 'Pages', icon: 'description'},
    {routerLink: [{'outlets': {'manage': ['clients']}}], text: 'Clients', icon: 'supervisor_account'},
    {routerLink: [{'outlets': {'manage': ['contracts']}}], text: 'Contracts', icon: 'note'},
		{routerLink: [{'outlets': {'manage': ['users']}}], text: 'Users', icon: 'account_circle'},
    {routerLink: [{'outlets': {'manage': ['tasks']}}], text: 'Tasks', icon: 'done_all'}
  ]

  public adminPanelRoutes: any = [
    {routerLink: ['/admin/panel', {'outlets': {'view': ['marketing-tools']}}], icon: 'pie_chart_outlined', text: 'Marketing Tools'},
    {routerLink: ['/admin/panel', {'outlets': {'view': ['performance']}}], icon: 'face', text: 'Performance'},
    {routerLink: ['/admin/panel', {'outlets': {'view': ['settings']}}], icon: 'settings', text: 'Settings'}
  ]

}
