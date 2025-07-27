import { Component, Input } from "@angular/core";
import { Expense } from "../../expenses/expenses.types";

@Component({
  selector: "app-expense-item",
  standalone: true,
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.css"],
})
export class ExpenseItemComponent {
  @Input() expense!: Expense;

  monthsPT: Record<string, string> = {
    JANUARY: "Janeiro",
    FEBRUARY: "Fevereiro",
    MARCH: "Março",
    APRIL: "Abril",
    MAY: "Maio",
    JUNE: "Junho",
    JULY: "Julho",
    AUGUST: "Agosto",
    SEPTEMBER: "Setembro",
    OCTOBER: "Outubro",
    NOVEMBER: "Novembro",
    DECEMBER: "Dezembro",
  };

  categoryPT: Record<string, string> = {
    FIXED_COSTS: "Gastos Fixos",
    COMFORT: "Conforto",
    GOALS: "Metas",
    KNOWLEDGE: "Conhecimento",
    PLEASURES: "Prazeres",
    FINANCIAL_FREEDOM: "Liberdade Financeira",
  };

  get monthPT(): string {
    return (
      this.monthsPT[this.expense.month.toString()] ||
      this.expense.month.toString()
    );
  }

  get categoryPTLabel(): string {
    return this.categoryPT[this.expense.category] || this.expense.category;
  }

  get formattedAmount(): string {
    if (!this.expense || this.expense.value == null) return "";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.expense.value);
  }
}
