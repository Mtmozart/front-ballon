import { Component, effect, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SelectComponent } from "../../components/select/select.component";
import { MatIconModule } from "@angular/material/icon";
import { provideNgxMask } from "ngx-mask";
import { ExpenseService } from "../expenses.service";
import { AuthService } from "../../features/auth/auth.services";
import { ToastrService } from "ngx-toastr";
import Chart from 'chart.js/auto';
import { Categories, CategoryAndValue } from "../expenses.types";

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
  ],
  providers: [provideNgxMask()],
  templateUrl: "./details-expense.component.html",
  styleUrls: ["./details-expense.component.css"],
})
export class DetailsExpensesComponent {
  monthForm: FormGroup;
  categoryForm: FormGroup;
  staticsByMonth: number = 0.0;
  private toastService = inject(ToastrService);
  private expenseService = inject(ExpenseService);
  private authService = inject(AuthService);
  readonly user = this.authService.user;
  monthsOptions = Object.entries(months).map(([value, label]) => ({
    value,
    label,
  }));
  public chart: any;
  public yearlyChart: any;
  public currentMonthLabel: string = '';
  private labels: string[] = []
  private spents: number[] = []
  private monthlyData: Array<{month: number, value: number}> = []

  constructor(private fb: FormBuilder) {
    this.monthForm = this.fb.group({
      month: [null],
    });

    this.categoryForm = this.fb.group({
      categoryId: [null],
    });
  }

  ngOnInit(): void {
    const monthKeys = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                       'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const currentMonthKey = monthKeys[new Date().getMonth()];
    this.currentMonthLabel = months[currentMonthKey as keyof typeof months];
    
    setTimeout(() => {
      this.monthForm.get("month")?.setValue(currentMonthKey, { emitEvent: false });
      this.updateTotalByMonth(currentMonthKey);
    }, 0);

    this.createChart();    
    this.monthForm.get("month")?.valueChanges.subscribe((month) => {
      this.currentMonthLabel = months[month as keyof typeof months];
      this.updateTotalByMonth(month);
    });
    
    this.expenseService.getStaticsRecurringByYear(2026).subscribe({
      next: (response) => {
        this.monthlyData = response;
        this.createYearlyChart();
      }
    });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Gastos por Categoria',
          data: this.spents,      
          backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#ffce56',
            '#4bc0c0',
            '#9966ff',
            '#ff9f40'
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: any) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(2);
                return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  updateTotalByMonth(month: string): void {
    this.staticsByMonth = 0
    this.labels = []
    this.spents = []
    const user = this.user();
    if (!user?.id) return;

    this.expenseService.getStaticsByMonthUserIdYear(user.id, month).subscribe({
      next: (response: Array<CategoryAndValue>) => {
        response.forEach((v: CategoryAndValue) => {
          this.labels.push(v.category + ' - ' +v.expense as unknown as string);
          this.spents.push(v.expense);
        });
        this.staticsByMonth = response.reduce((total, r) => total + r.expense, 0);
        this.createChart()
      },
      error: (err) => {
        this.toastService.error("Erro ao buscar estatísticas do mês.");
        this.staticsByMonth = 0;
      },
    });
  }

  categoryFromString(category: string): Categories | undefined {
   return Categories[category as keyof typeof Categories];
  }

  createYearlyChart() {
    if (this.yearlyChart) {
      this.yearlyChart.destroy();
    }
      
    this.yearlyChart = new Chart("YearlyChart", {
      type: 'bar',
      data: {
        labels: this.mapperRecurringData().map(item => item.month),
        datasets: [{
          label: 'Despseas Repetitivas Mensais',
          data: this.mapperRecurringData().map(item => item.value),
          backgroundColor: '#36a2eb',
          borderColor: '#2563eb',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const value = context.parsed?.y || 0;
                return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              }
            }
          }
        }
      }
    });
  }

  private mapperRecurringData(): Array<{month: string, value: number}> {
    return this.monthlyData.map(item => {
      const monthIndex = item.month - 1;
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return { month: monthNames[monthIndex], value: item.value };
    });
  }
}