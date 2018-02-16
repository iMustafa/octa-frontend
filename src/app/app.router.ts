import { Routes } from '@angular/router'

export const ROUTES: Routes = [
  { path: 'login', loadChildren: './modules/auth/auth.module#AuthModule' },
  { path: 'me', loadChildren: './modules/user/user.module#UserModule' },
  { path: 'admin', loadChildren: './modules/admin/admin.module#AdminPanelModule' }
]
