import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ApiResponse, Employee} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://dummy.restapiexample.com/api/v1';

  private localEmployees: Employee[] = [];
  private nextId = 1000;

  constructor(
    private readonly http: HttpClient,
  ) {}

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/employees`).pipe(
      map(response => {
        const apiEmployees = response.data || [];
        return [...apiEmployees, ...this.localEmployees];
      }),
      catchError(() => of(this.localEmployees))
    );
  }

  public getEmployee(id: number): Observable<Employee | undefined> {
    const localEmployee = this.localEmployees.find(emp => emp.id === id);
    if (localEmployee) {
      return of(localEmployee);
    }

    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/employee/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(undefined))
    );
  }

  public createEmployee(employee: Employee): Observable<Employee> {
    const newEmployee = { ...employee, id: this.nextId++ };
    this.localEmployees.push(newEmployee);
    return of(newEmployee);
  }

  public updateEmployee(id: number, employee: Employee): Observable<Employee> {
    const index = this.localEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.localEmployees[index] = { ...employee, id };
      return of(this.localEmployees[index]);
    }

    const updatedEmployee = { ...employee, id };
    this.localEmployees.push(updatedEmployee);
    return of(updatedEmployee);
  }

  public deleteEmployee(id: number): Observable<boolean> {
    const index = this.localEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.localEmployees.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
