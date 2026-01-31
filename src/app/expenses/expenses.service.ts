// expense.service.ts
import { inject, Injectable } from "@angular/core";
import { map, Observable, Subject, tap } from "rxjs";
import { ApiService } from "../api/api.service";
import { CategoryAndValue, CreateExpense, Expense, ExpensesPaginate } from "./expenses.types";

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  private readonly endpoint = "expenses";
  private readonly apiService = inject(ApiService);

  private reloadExpensesSource = new Subject<void>();
  reloadExpenses$ = this.reloadExpensesSource.asObservable();

  constructor() {}

  register(expense: CreateExpense): Observable<Expense> {
    return this.apiService
      .post<Expense>(this.endpoint, expense)
      .pipe(tap(() => this.reloadExpensesSource.next()));
  }

  recurringExpenses(expense: CreateExpense): Observable<Expense[]> {
    const endpointToGenerateRecurring = this.endpoint + '/recurring'
    return this.apiService
      .post<Expense[]>(endpointToGenerateRecurring, expense)
      .pipe(tap(() => this.reloadExpensesSource.next()));
  }

  findAllExpensesByUserId(id: string, search: string = '', page: number = 0, size: number = 15): Observable<ExpensesPaginate> {
  const route = `${this.endpoint}/all?search=${search}&page=${page}&size=${size}`;
    const expenses = this.apiService.get<ExpensesPaginate>(route).pipe(
    map(response =>  response)
  );
 return expenses;
 }

  deleteExpenseById(expenseId: string): Observable<void> {
    const route = `${this.endpoint}/${expenseId}`;
    return this.apiService
      .delete<void>(route)
      .pipe(
        tap(() => this.reloadExpensesSource.next()),
      );
  }

  getStaticsByMonthAndUserId(id: string, month: string): Observable<{ statics: number }> {
    const route = `${this.endpoint}/users/${id}/month/${month}`;
    return this.apiService.get<{statics: number}>(route);
  }

  getStaticsByMonthUserIdYear(id: string, month: string, year: number = 2026): Observable<Array<CategoryAndValue>> {
    const route = `${this.endpoint}/users/${id}/month/${month}/year/${year}`;
    return  this.apiService.get<Array<CategoryAndValue>>(route);
  }
}
