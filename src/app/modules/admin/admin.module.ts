import { NgModule } from "@angular/core"
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SystemAdminService } from './services/system-admin.service';
import { GraphAPIService } from './services/graph-api.service'
import { AuthorizationService } from '../globals/services/authorization.service';
import { SocketService } from '../globals/services/socket.service';

import { ADMINROUTES } from './admin.router'

import {
    MdNativeDateModule, MdProgressSpinnerModule, MdIconModule, MdSelectModule,
    MdDatepickerModule, MdButtonModule, MdSidenavModule, MdInputModule, MatCheckboxModule
} from '@angular/material';

import { MatchHeightMaxDirective } from '../globals/directives/match-height-max.directive';
import { DateConvPipe } from '../globals/pipes/date-conv.pipe';
import { GetStatePipe } from './pipes/get-state.pipe'

import { AdminComponent } from './admin.component';
import { AdminNavbarComponent } from './layout/navbar/navbar.component'
import { SettingsComponent } from './pages/settings/settings.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { MarketingToolsComponent } from './pages/marketing-tools/marketing-tools.component';
import { AddPackgeDialog } from './pages/settings/packages/packages.component';
import { PackageEditDialog } from './pages/settings/packages/packages.component';
import { PackagesComponent } from './pages/settings/packages/packages.component';
import { PagesComponent } from './pages/settings/pages/pages.component';
import { AddPageDialog } from './pages/settings/pages/pages.component';
import { UsersComponent } from './pages/settings/users/users.component';
import { TasksComponent } from './pages/settings/tasks/tasks.component';
import { AddTaskDialog } from './pages/settings/tasks/tasks.component';
import { UpdateTaskDialog } from './pages/settings/tasks/tasks.component';
import { AddUserDialog } from './pages/settings/users/users.component';
import { UpdateUserDialog } from './pages/settings/users/users.component';
import { ClientsComponent } from './pages/settings/clients/clients.component';
import { ContractsComponent } from './pages/settings/contracts/contracts.component';
import { ExtendContractDialog } from './pages/settings/contracts/contracts.component';
import { AddContractDialog } from './pages/settings/contracts/contracts.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(ADMINROUTES),
        MdNativeDateModule, MdProgressSpinnerModule, MdIconModule, MdSelectModule,
        MdDatepickerModule, MdButtonModule, MdSidenavModule, MdInputModule, MatCheckboxModule
    ],
    declarations: [
        MatchHeightMaxDirective,
        DateConvPipe,
        GetStatePipe,
        AdminComponent,
        AdminNavbarComponent,
        SettingsComponent,
        PerformanceComponent,
        MarketingToolsComponent,
        AddPackgeDialog,
        PackageEditDialog,
        AddContractDialog,
				PagesComponent,
				AddPageDialog,
        PackagesComponent,
				UsersComponent,
				AddUserDialog,
				UpdateUserDialog,
        ClientsComponent,
        ContractsComponent,
				ExtendContractDialog,
				TasksComponent,
				AddTaskDialog,
				UpdateTaskDialog
    ],
    providers: [
        SystemAdminService,
        AuthorizationService,
				SocketService,
				GraphAPIService
    ],
    entryComponents: [
        AddPackgeDialog,
        PackageEditDialog,
        AddContractDialog,
				ExtendContractDialog,
				AddPageDialog,
				AddUserDialog,
				UpdateUserDialog,
				AddTaskDialog,
				UpdateTaskDialog
    ]
})
export class AdminPanelModule {

}