import { Component } from "@angular/core";
import { RegisterExpenseComponent } from "../../register/register.component";
import { ListAllExpensesByIdComponent } from "../../list-all/list-all-expenses-by-id.component";
import { TitleComponent } from "../../../common/components/title/title.component";
import { DetailsExpensesComponent } from "../../details/details-expense.componet";

@Component({
  standalone: true,
  imports: [
    DetailsExpensesComponent,
    TitleComponent,
  ],
  styleUrls: ["register-expense-page.component.css"],
  templateUrl: "./register-expense-page.component.html",
})
export class ExpenseDetailsPage {}
