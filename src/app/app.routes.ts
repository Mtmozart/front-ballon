import { Routes } from "@angular/router";
import { RegisterConsumerComponent } from "./customer/register/register.componet";
import { AuthComponent } from "./features/auth/auth.component";
import { ProfileComponent } from "./customer/profile/profile.component";
import { AuthGuard } from "./features/auth/auth.guard";
import { ExpensePage } from "./expenses/pages/register-expense/register-expense-page.component";
import { ExpenseDetailsPage } from "./expenses/pages/details/register-expense-page.component";
import { PlubicGuard } from "./features/auth/public.guard";

export const routes: Routes = [
  {
    path: "register",
    canActivate: [PlubicGuard],
    component: RegisterConsumerComponent,
  },
  {
    path: "auth",
    canActivate: [PlubicGuard],
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
  {
    path: "details",
    canActivate: [AuthGuard],
    component: ExpenseDetailsPage,
  },
];
