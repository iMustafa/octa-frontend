import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { AuthorizationService } from '../../services/authorization.service';
import { CookiesService } from '../../services/cookies.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  public admin: boolean = true;

  constructor(private _auth: AuthorizationService, private cookies: CookiesService) {

  }

  ngOnInit() {
    var url = "http://127.0.0.1:8080/user_api/check_user";
    this._auth.sendTokenizedRequest(null, url, 'Get')
      .then(response => {
        var re = JSON.parse(response._body);
        re.response == "admin" ? this.admin = true : this.admin = false
      })
      .catch(reject => {
        console.log(reject);
      });
  }

}
