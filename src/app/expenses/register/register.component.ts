import { CommonModule } from "@angular/common";
import { Component, inject, effect } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SelectComponent } from "../../components/select/select.component";
import { AuthService } from "../../features/auth/auth.services";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { MatIconModule } from "@angular/material/icon";
import { ExpenseService } from "../expenses.service";
import { CreateExpense, Expense } from "../expenses.types";
import { CategoryEnum } from "./register.types";

interface IRegisterExpense {
  month: FormControl;
  year: FormControl;
  title: FormControl;
  value: FormControl;
  categoryId: FormControl;
}

const categoryOptions = [
  { value: CategoryEnum.FIXED_COSTS, label: "Gastos Fixos" },
  { value: CategoryEnum.COMFORT, label: "Conforto" },
  { value: CategoryEnum.GOALS, label: "Metas" },
  { value: CategoryEnum.KNOWLEDGE, label: "Conhecimento" },
  { value: CategoryEnum.PLEASURES, label: "Prazeres" },
  { value: CategoryEnum.FINANCIAL_FREEDOM, label: "Liberdade Financeira" },
];

const months = {
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

export const expenseValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const month = control.get("month")?.value;
  const year = control.get("year")?.value;
  const title = control.get("title")?.value;
  const value = control.get("value")?.value;
  const categoriaId = control.get("categoryId")?.value;

  if (!month || !year || !title || !value || !categoriaId) {
    return { required: "Todos os campos são obrigatórios" };
  }
  return null;
};

@Component({
  selector: "register-expense-component",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectComponent,
    NgxMaskDirective,
    MatIconModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterExpenseComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastrService);
  private expenseService = inject(ExpenseService);
  private expenses: Expense[] = [];
  readonly user = this.authService.user;
  registerExpenseForm: FormGroup<IRegisterExpense>;
  categoriaOptions = categoryOptions;
  monthsOptions = Object.entries(months).map(([value, label]) => ({
    value,
    label,
  }));

  constructor(private service: ExpenseService) {
    this.registerExpenseForm = new FormGroup<IRegisterExpense>(
      {
        month: new FormControl("", [Validators.required]),
        year: new FormControl("", [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(/^\d+$/),
        ]),
        title: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        value: new FormControl("", [Validators.required]),
        categoryId: new FormControl("", [Validators.required]),
      },
      { validators: expenseValidator },
    );

    effect(() => {
      const user = this.user();
      if (user) {
        this.getCurrentUser();
      }
    });
  }

  onSubmit() {
    const user = this.user();
    if (!user?.id) {
      this.toastService.error("Usuário não autenticado.");
      return;
    }
    const rawValue = this.registerExpenseForm.get("value")?.value;
    let numericValue;

    if (typeof rawValue === "string") {
      numericValue = parseFloat(rawValue.replace(/[^\d,]/g, "")) || 0;
    }
    numericValue = rawValue;
    if (this.registerExpenseForm.valid) {
      const expense: CreateExpense = {
        month: this.registerExpenseForm.value.month,
        categoriaId: this.registerExpenseForm.value.categoryId,
        consumerId: user.id,
        title: this.registerExpenseForm.value.title,
        value: numericValue,
        year: this.registerExpenseForm.value.year,
      };
      this.expenseService.register(expense).subscribe({
        next: () => {
          this.toastService.success("Despensa registrada com sucesso.");
        },
        error: (err) => {
          console.error("Erro:", err);
          this.toastService.error("Erro ao gerar despesa.");
        },
      });
      this.registerExpenseForm.reset();
    } else {
      this.toastService.error(
        "Por favor, preencha todos os campos corretamente.",
      );
      this.registerExpenseForm.markAllAsTouched();
    }
  }
  private getCurrentUser() {
    const user = this.user();
  }
}
