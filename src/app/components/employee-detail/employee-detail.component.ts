import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  public employee = signal<Employee | null>(null);
  public loading = signal(false);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(+id);
    }
  }

  public goBack(): void {
    this.router.navigate(['/']);
  }

  loadEmployee(id: number): void {
    this.loading.set(true);
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employee.set(employee || null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        alert('Erro ao carregar funcionário');
      }
    });
  }
}
