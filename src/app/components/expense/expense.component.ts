import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "expense-component",
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.css"],
})
export class ExpenseComponent {
  showMessage = true;
}
