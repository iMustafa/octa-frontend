import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '../material/material.module'

import { AuthenticationService } from './services/authentication.service'
import { AuthorizationService } from '../globals/services/authorization.service'

import { AUTHROUTES } from './auth.router'

import { NavbarComponent } from '../globals/layouts/navbar/navbar.component'
import { LoginComponent } from './pages/login/login.component'


@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(AUTHROUTES),
		MaterialModule
	],
	declarations: [
		LoginComponent,
		NavbarComponent
	],
	providers: [
		AuthenticationService
	]
})
export class AuthModule {

}