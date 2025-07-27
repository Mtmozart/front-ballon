import { Component, effect, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpenseService } from "../expenses.service";
import { AuthService } from "../../features/auth/auth.services";
import { Expense } from "../expenses.types";
import { Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { ExpenseItemComponent } from "../../components/expense/expense.component";
import { MatIconModule } from "@angular/material/icon";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-list-all-expenses-by-id",
  standalone: true,
  imports: [CommonModule, ExpenseItemComponent, MatIconModule],
  templateUrl: "./list-all-expenses-by-id.component.html",
  styleUrls: ["./list-all-expenses-by-id.component.css"],
})
export class ListAllExpensesByIdComponent implements OnDestroy {
  expenses$: Observable<Expense[]> | undefined;
  private toastService = inject(ToastrService);
  private reloadSub?: Subscription;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
  ) {
    effect(() => {
      const user = this.authService.user();
      if (user?.id) {
        this.loadExpenses();

        // Inscreve-se no evento de recarga para atualizar lista automaticamente
        this.reloadSub = this.expenseService.reloadExpenses$.subscribe(() => {
          this.loadExpenses();
        });
      }
    });
  }

  ngOnDestroy() {
    this.reloadSub?.unsubscribe();
  }

  onEdit(expense: Expense) {
    console.log("Editar despesa:", expense);
  }

  onDelete(id: string) {
    this.expenseService.deleteExpenseById(id).subscribe({
      next: () => {
        this.toastService.success("Despesa excluída com sucesso.");
        this.loadExpenses();
      },
      error: (err: any) => {
        console.error("Erro:", err);
        this.toastService.error("Erro ao excluir despesa.");
      },
    });
  }

  loadExpenses() {
    const user = this.authService.user();
    if (user?.id) {
      this.expenses$ = this.expenseService
        .findAllExpensesByUserId(user.id)
        .pipe(
          tap({
            error: (err) => console.error("Erro ao buscar despesas:", err),
          }),
        );
    }
  }
}
