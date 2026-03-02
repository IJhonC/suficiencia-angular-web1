import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

export const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'employee/new', component: EmployeeFormComponent },
  { path: 'employee/edit/:id', component: EmployeeFormComponent },
  { path: 'employee/:id', component: EmployeeDetailComponent },
  { path: '**', redirectTo: '' }
];
