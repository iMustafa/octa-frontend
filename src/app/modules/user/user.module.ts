import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { MaterialModule } from '../material/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SystemAdminService } from '../../modules/admin/services/system-admin.service'
import { SocketService } from '../globals/services/socket.service'

import { TasksPageComponent } from './pages/tasks-page/tasks-page.component'
import { MyProfileComponent } from './pages/profile/my-profile.component'
import { USERROUTER } from './user.router'

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(USERROUTER)
	],
	declarations: [
		TasksPageComponent,
		MyProfileComponent
	],
	providers: [SystemAdminService, SocketService]
})
export class UserModule {

}