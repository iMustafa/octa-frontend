import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import 'rxjs';

@Injectable()
export class AuthenticationService {

	constructor(private router: Router) { }

}
