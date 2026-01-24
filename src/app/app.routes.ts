import { Routes } from "@angular/router";
import { RegisterConsumerComponent } from "./customer/register/register.componet";
import { AuthComponent } from "./features/auth/auth.component";
import { ProfileComponent } from "./customer/profile/profile.component";
import { authGuard } from "./features/auth/auth.guard";
import { ExpensePage } from "./expenses/pages/register-expense/register-expense-page.component";
import { ExpenseDetailsPage } from "./expenses/pages/details/register-expense-page.component";
import { publicGuard } from "./features/auth/public.guard";

export const routes: Routes = [
  {
    path: "register",
    canActivate: [publicGuard],
    component: RegisterConsumerComponent,
  },
  {
    path: "auth",
    canActivate: [publicGuard],
    component: AuthComponent,
  },
  {
    path: "profile",
    canActivate: [authGuard],
    component: ProfileComponent,
  },
  {
    path: "expenses",
    canActivate: [authGuard],
    component: ExpensePage,
  },
  {
    path: "details",
    canActivate: [authGuard],
    component: ExpenseDetailsPage,
  },
];
