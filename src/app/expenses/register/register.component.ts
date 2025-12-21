import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
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
import { CreateExpense } from "../expenses.types";
import { CategoryEnum } from "./register.types";

interface IRegisterExpense {
  month: FormControl;
  year: FormControl;
  title: FormControl;
  value: FormControl;
  categoryId: FormControl;
  isRecorrente: FormControl<boolean>;
  recurring: FormControl<number | null>;
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

  readonly user = this.authService.user;
  registerExpenseForm: FormGroup<IRegisterExpense>;
  categoriaOptions = categoryOptions;
  monthsOptions = Object.entries(months).map(([value, label]) => ({ value, label }));

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

    // ✔ Checkbox com tipo certo, sem permitir null
    isRecorrente: new FormControl<boolean>(false, { nonNullable: true }),

    // ✔ Campo opcional, aceita null
    recurring: new FormControl<number | null>(null),
  },
  { validators: expenseValidator }
);


    // ✔ habilitar / desabilitar recurring
    this.registerExpenseForm.get('isRecorrente')?.valueChanges.subscribe((checked) => {
      const recurringField = this.registerExpenseForm.get('recurring');

      if (checked) {
        recurringField?.enable();
        recurringField?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        recurringField?.disable();
        recurringField?.clearValidators();
        recurringField?.setValue(null);
      }

      recurringField?.updateValueAndValidity();
    });
  }

  onSubmit() {
    const user = this.user();
    if (!user?.id) {
      this.toastService.error("Usuário não autenticado.");
      return;
    }

    const rawValue = this.registerExpenseForm.get("value")?.value;
    let numericValue = rawValue;

    if (typeof rawValue === "string") {
      numericValue = parseFloat(rawValue.replace(/[^\d,]/g, "")) || 0;
    }

    if (this.registerExpenseForm.valid) {
      const form = this.registerExpenseForm.getRawValue();

      const expense: CreateExpense = {
        month: form.month,
        categoriaId: form.categoryId,
        consumerId: user.id,
        title: form.title,
        value: numericValue,
        year: form.year,
        recurring: form.isRecorrente ? Number(form.recurring) : 0,
      };
      if(expense.recurring && expense.recurring  > 0){
        this.expenseService.recurringExpenses(expense).subscribe({
          next: () => this.toastService.success("Despensa registrada com sucesso."),
          error: () => this.toastService.error("Erro ao gerar despesa."),
       });     
      } else {
        this.expenseService.register(expense).subscribe({
          next: () => this.toastService.success("Despensa registrada com sucesso."),
          error: () => this.toastService.error("Erro ao gerar despesa."),
        });
      }

      

      this.registerExpenseForm.reset({ isRecorrente: false });
    } else {
      this.toastService.error("Por favor, preencha todos os campos corretamente.");
      this.registerExpenseForm.markAllAsTouched();
    }
  }
}
