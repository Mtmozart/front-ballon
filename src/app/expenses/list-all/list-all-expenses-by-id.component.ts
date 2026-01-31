import { Component, effect, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpenseService } from "../expenses.service";
import { AuthService } from "../../features/auth/auth.services";
import { Expense, ExpenseData } from "../expenses.types";
import { Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { ExpenseItemComponent } from "../../components/expense/expense.component";
import { MatIconModule } from "@angular/material/icon";
import { of } from 'rxjs';
@Component({
  selector: "app-list-all-expenses-by-id",
  standalone: true,
  imports: [CommonModule, ExpenseItemComponent, MatIconModule],
  templateUrl: "./list-all-expenses-by-id.component.html",
  styleUrls: ["./list-all-expenses-by-id.component.css"],
})
export class ListAllExpensesByIdComponent implements OnDestroy {
  expenses$: Observable<ExpenseData[]> | undefined;
  private reloadSub?: Subscription;

  public currentPage: number = 0;
  public totalPages: number = 0;
  public size: number = 12;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {
    effect(() => {
      const user = this.authService.user();
      if (user?.id) {
        this.loadExpenses();

        this.reloadSub = this.expenseService.reloadExpenses$.subscribe(() => {
          this.loadExpenses();
        });
      }
    });
  }

  ngOnDestroy() {
    this.reloadSub?.unsubscribe();
  }

loadExpenses(page: number = 0) {
  const user = this.authService.user();
  if (!user?.id) return;

  this.currentPage = page;
  this.expenseService
    .findAllExpensesByUserId(user.id, page, this.size)
    .pipe(
      tap({
        next: (res) => {         
          this.totalPages = res.totalPages;
          this.expenses$ = of(res.expenses); 
        },
        error: (err) => console.error("Erro ao buscar despesas:", err),
      })
    )
    .subscribe();
}

  nextPage() {
    if (this.currentPage + 1 >= this.totalPages) return;
    this.loadExpenses(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage <= 0) return;
    this.loadExpenses(this.currentPage - 1);
  }
}
