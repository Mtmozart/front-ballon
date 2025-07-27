import { Routes } from "@angular/router";
import { RegisterConsumerComponent } from "./customer/register/register.componet";
import { AuthComponent } from "./features/auth/auth.component";
import { ProfileComponent } from "./customer/profile/profile.component";
import { AuthGuard } from "./features/auth/auth.guard";
import { RegisterExpenseComponent } from "./expenses/register/register.component";
import { ExpensePage } from "./expenses/pages/register-expense-page.component";
export const routes: Routes = [
  {
    path: "",
    component: RegisterConsumerComponent,
  },
  {
    path: "auth",
    component: AuthComponent,
  },

  {
    path: "profile",
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: "expenses",
    canActivate: [AuthGuard],
    component: ExpensePage,
  },
];
