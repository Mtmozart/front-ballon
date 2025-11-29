// expense.service.ts
import { Injectable } from "@angular/core";
import { map, Observable, Subject, tap } from "rxjs";
import { ApiService } from "../api/api.service";
import { AuthService } from "../features/auth/auth.services";
import { CategoryAndValue, CreateExpense, Expense, ExpensesPaginate } from "./expenses.types";

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  private readonly endpoint = "expenses";

  private reloadExpensesSource = new Subject<void>();
  reloadExpenses$ = this.reloadExpensesSource.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  register(expense: CreateExpense): Observable<Expense> {
    const token = this.authService.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    return this.apiService
      .post<Expense>(this.endpoint, expense, { headers })
      .pipe(tap(() => this.reloadExpensesSource.next()));
  }

  recurringExpenses(expense: CreateExpense): Observable<Expense[]> {

    const token = this.authService.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const endpointToGenerateRecurring = this.endpoint + '/recurring'
    return this.apiService
      .post<Expense[]>(endpointToGenerateRecurring, expense, { headers })
      .pipe(tap(() => this.reloadExpensesSource.next()));
  }

  findAllExpensesByUserId(id: string, page: number = 0, size: number = 15): Observable<ExpensesPaginate> {
  const token = this.authService.getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  
  const route = `${this.endpoint}/users/${id}?page=${page}&size=${size}`;

 return this.apiService.get<ExpensesPaginate>(route, { headers }).pipe(
    map(response => response)
  );
 }

  deleteExpenseById(expenseId: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const route = `${this.endpoint}/${expenseId}`;
    return this.apiService
      .delete<void>(route, {
        headers,
      })
      .pipe(
        tap(() => this.reloadExpensesSource.next()),
      );
  }

  getStaticsByMonthAndUserId(id: string, month: string): Observable<{ statics: number }> {
    const token = this.authService.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const route = `${this.endpoint}/users/${id}/month/${month}`;
    return this.apiService.get<{statics: number}>(route, {
      headers,
    });
  }

  getStaticsByMonthUserIdYear(id: string, month: string, year: number = 2025): Observable<Array<CategoryAndValue>> {
    const token = this.authService.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const route = `${this.endpoint}/users/${id}/month/${month}/year/${year}`;
    const response =  this.apiService.get<Array<CategoryAndValue>>(route, {
      headers,
    });
    return response
  }
}
