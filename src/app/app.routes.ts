import { Routes } from "@angular/router";
import { RegisterConsumerComponent } from "./customer/register/register.componet";
import { AuthComponent } from "./features/auth/auth.component";
export const routes: Routes = [
  {
    path: "",
    component: RegisterConsumerComponent,
  },
  {
    path: "auth",
    component: AuthComponent,
  },
];
