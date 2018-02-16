import { Routes, CanActivate } from '@angular/router'

import { AdminComponent } from './admin.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PackagesComponent } from './pages/settings/packages/packages.component';
import { PagesComponent } from './pages/settings/pages/pages.component';
import { UsersComponent } from './pages/settings/users/users.component';
import { ClientsComponent } from './pages/settings/clients/clients.component';
import { ContractsComponent } from './pages/settings/contracts/contracts.component';
import { TasksComponent } from './pages/settings/tasks/tasks.component';

import { PerformanceComponent } from './pages/performance/performance.component';
import { MarketingToolsComponent } from './pages/marketing-tools/marketing-tools.component';

export const ADMINROUTES: Routes = [
    {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
    },
    {
        path: 'panel',
        component: AdminComponent,
        children: [
            {
                path: "settings",
                component: SettingsComponent,
                outlet: "view",
                children: [
                    { path: 'packages', component: PackagesComponent, outlet: "manage" },
                    { path: 'pages', component: PagesComponent, outlet: "manage" },
                    { path: 'users', component: UsersComponent, outlet: "manage" },
                    { path: 'clients', component: ClientsComponent, outlet: "manage" },
                    { path: 'contracts', component: ContractsComponent, outlet: "manage" },
                    { path: 'tasks', component: TasksComponent, outlet: "manage" }
                ]
            },
            {
                path: "performance",
                component: PerformanceComponent,
                outlet: "view"
            },
            {
                path: "marketing-tools",
                component: MarketingToolsComponent,
                outlet: "view"
            }
        ]
    }
]