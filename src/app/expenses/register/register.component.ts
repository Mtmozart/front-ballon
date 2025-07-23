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

interface IRegisterExpense {
  month: FormControl<string | null>;
  year: FormControl<string | null>;
  title: FormControl<string | null>;
  value: FormControl<string | null>;
  consumerId: FormControl<string | null>;
  categoriaId: FormControl<string | null>;
}

const categories = {
  FIXED_COSTS: "Gastos fixos",
  COMFORT: "Conforto",
  GOALS: "Metas",
  KNOWLEDGE: "Conhecimento",
  PLEASURES: "Prazeres",
  FINANCIAL_FREEDOM: "Liberdade financeira",
};

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
  const categoriaId = control.get("categoriaId")?.value;

  if (!month || !year || !title || !value || !categoriaId) {
    return { required: "Todos os campos são obrigatórios" };
  }

  return null;
};

@Component({
  selector: "expense-page",
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

  readonly user = this.authService.user;
  registerExpenseForm: FormGroup<IRegisterExpense>;

  categoriaOptions = Object.entries(categories).map(([value, label]) => ({
    value,
    label,
  }));

  monthsOptions = Object.entries(months).map(([value, label]) => ({
    value,
    label,
  }));

  constructor() {
    this.registerExpenseForm = new FormGroup<IRegisterExpense>(
      {
        month: new FormControl("", [Validators.required]),
        year: new FormControl("", [
          Validators.required,
          Validators.pattern(/^\d{4}$/),
        ]),
        title: new FormControl("", [Validators.required]),
        value: new FormControl("", [Validators.required]),
        consumerId: new FormControl(""),
        categoriaId: new FormControl("", [Validators.required]),
      },
      { validators: expenseValidator },
    );

    effect(() => {
      this.getCurrentUser();
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
      const formValue = {
        ...this.registerExpenseForm.value,
        consumerId: user.id,
        value: numericValue,
      };
      console.log("Form enviado:", formValue);
      this.toastService.success("Despesa registrada com sucesso!");
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
    console.log("Usuário atual:", user);
  }
}
