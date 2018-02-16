import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { MyProfileComponent } from './pages/profile/my-profile.component';

export const USERROUTER: any[] = [
    { path: 'tasks', component: TasksPageComponent },
    { path: 'profile', component: MyProfileComponent }
]