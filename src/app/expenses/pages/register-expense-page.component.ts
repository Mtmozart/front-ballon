import { Component } from "@angular/core";
import { RegisterExpenseComponent } from "../register/register.component";
import { ListAllExpensesByIdComponent } from "../list-all/list-all-expenses-by-id.component";
import { TitleComponent } from "../../common/components/title/title.component";

@Component({
  standalone: true,
  imports: [
    RegisterExpenseComponent,
    ListAllExpensesByIdComponent,
    TitleComponent,
  ],
  styleUrls: ["register-expense-page.component.css"],
  templateUrl: "./register-expense-page.component.html",
})
export class ExpensePage {}
