import { Component, effect, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SelectComponent } from "../../components/select/select.component";
import { CategoryEnum } from "../register/register.types";
import { MatIconModule } from "@angular/material/icon";
import { TitleComponent } from "../../common/components/title/title.component";
import { provideNgxMask } from "ngx-mask";
import { ExpenseService } from "../expenses.service";
import { AuthService } from "../../features/auth/auth.services";
import { ToastrService } from "ngx-toastr";
import Chart from 'chart.js/auto';

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

@Component({
  selector: "detail-expense-component",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectComponent,
    MatIconModule,
    TitleComponent,
  ],
  providers: [provideNgxMask()],
  templateUrl: "./details-expense.component.html",
  styleUrls: ["./details-expense.component.css"],
})
export class DetailsExpensesComponent {
  // Formulários separados
  monthForm: FormGroup;
  categoryForm: FormGroup;
  staticsByMonth: number = 0.0;
  staticsByCategory: number = 0.0;
  private toastService = inject(ToastrService);
  private expenseService = inject(ExpenseService);
  private authService = inject(AuthService);
  readonly user = this.authService.user;
  monthsOptions = Object.entries(months).map(([value, label]) => ({
    value,
    label,
  }));
  public chart: any;

  categoryOptions = [
    { value: CategoryEnum.FIXED_COSTS, label: "Gastos Fixos" },
    { value: CategoryEnum.COMFORT, label: "Conforto" },
    { value: CategoryEnum.GOALS, label: "Metas" },
    { value: CategoryEnum.KNOWLEDGE, label: "Conhecimento" },
    { value: CategoryEnum.PLEASURES, label: "Prazeres" },
    { value: CategoryEnum.FINANCIAL_FREEDOM, label: "Liberdade Financeira" },
  ];

  constructor(private fb: FormBuilder) {
    this.monthForm = this.fb.group({
      month: [null],
    });

    this.categoryForm = this.fb.group({
      categoryId: [null],
    });
    effect(() => {
      const user = this.user();
      if (user) {
        this.getCurrentUser();
      }
    });
  }

  ngOnInit(): void {
    this.createChart();
    
    this.monthForm.get("month")?.valueChanges.subscribe((month) => {
      this.updateTotalByMonth(month);
    });

    this.categoryForm.get("categoryId")?.valueChanges.subscribe((category) => {
      this.updateTotalByCategory(category);
    });
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: ['Gastos Fixos', 'Conforto', 'Metas', 'Conhecimento', 'Prazeres', 'Liberdade Financeira'],
        datasets: [{
          label: 'Gastos por Categoria',
          data: [300, 240, 100, 150, 200, 50],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  updateTotalByMonth(month: string): void {
    const user = this.user();
    if (!user?.id) return;

    this.expenseService.getStaticsByMonthUserIdYear(user.id, month).subscribe({
      next: (response: Array<{ category: string, expense: number }>) => {
        console.log(response)
        this.staticsByMonth = response[0].expense ?? 0;
      },
      error: (err) => {
        this.toastService.error("Erro ao buscar estatísticas do mês.");
        console.error(err);
        this.staticsByMonth = 0;
      },
    });
  }

  updateTotalByCategory(categoryId: CategoryEnum): void {
    this.staticsByCategory =
      categoryId === CategoryEnum.FIXED_COSTS ? 250 : 150;
  }

  private getCurrentUser() {
    const user = this.user();
  }
}