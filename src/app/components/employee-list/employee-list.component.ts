import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  public employees = signal<Employee[]>([]);
  public loading = signal(false);
  public error = signal<string | null>(null);

  constructor(
    private readonly employeeService: EmployeeService
  ) {
  }

  ngOnInit() {
    this.loadEmployees();
  }

  public deleteEmployee(id: number | undefined): void {
    if (!id || !confirm('Tem certeza que deseja excluir este funcionário?')) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: () => {
        alert('Erro ao excluir funcionário');
      }
    });
  }

  private loadEmployees(): void {
    this.loading.set(true);
    this.error.set(null);

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar funcionários');
        this.loading.set(false);
      }
    });
  }
}
