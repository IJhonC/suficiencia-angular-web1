import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  public employeeForm!: FormGroup;
  public isEditMode = signal(false);
  public employeeId = signal<number | null>(null);
  public loading = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService
  ) {
  }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      employee_name: ['', [Validators.required, Validators.minLength(3)]],
      employee_salary: ['', [Validators.required, Validators.min(0)]],
      employee_age: ['', [Validators.required, Validators.min(0)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.employeeId.set(+id);
      this.loadEmployee(+id);
    }
  }

  public onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    this.loading.set(true);
    const employeeData = this.employeeForm.value;

    if (this.isEditMode() && this.employeeId()) {
      this.employeeService.updateEmployee(this.employeeId()!, employeeData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.loading.set(false);
          alert('Erro ao atualizar funcionário');
        }
      });
    } else {
      this.employeeService.createEmployee(employeeData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.loading.set(false);
          alert('Erro ao criar funcionário');
        }
      });
    }
  }

  public cancel(): void {
    this.router.navigate(['/']);
  }

  private loadEmployee(id: number): void {
    this.loading.set(true);
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        if (employee) {
          this.employeeForm.patchValue(employee);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        alert('Erro ao carregar funcionário');
      }
    });
  }
}
