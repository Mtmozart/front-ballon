// expense.service.ts
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { ApiService } from "../api/api.service";
import { AuthService } from "../features/auth/auth.services";
import { CategoryAndValue, CreateExpense, Expense } from "./expenses.types";

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

  findAllExpensesByUserId(id: string): Observable<Expense[]> {
    const token = this.authService.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const route = `${this.endpoint}/users/${id}`;
    return this.apiService.get<Expense[]>(route, {
      headers,
    });
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
