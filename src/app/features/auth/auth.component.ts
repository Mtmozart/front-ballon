import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "./auth.services";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { switchMap, tap } from "rxjs";

type ILoginForm = {
  email: FormControl;
  password: FormControl;
};

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimaryInputComponent,
    DefaultLoginLayoutComponent,
  ],
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent {
  loginForm!: FormGroup<ILoginForm>;
  constructor(
    private service: AuthService,
    private toastService: ToastrService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup(
      {
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
      },
      {},
    );
  }

  get user() {
    const user = this.service.user();
    return user;
  }

  submitForm() {
    const data: Data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.service
      .login(data.email, data.password)
      .pipe(
        tap((response) => {
          this.toastService.success("Login efetuado com sucesso.");
          localStorage.setItem("token", response.token);
        }),
        switchMap(() => this.service.getUserByToken()),
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.navigate("profile");
          } else {
            this.toastService.error(
              "Não foi possível carregar dados do usuário.",
            );
          }
        },
        error: () => {
          this.toastService.error("Erro ao carregar dados do usuário.");
        },
      });
  }

  navigate(path: string) {
    this.router.navigate([`/${path}`]);
  }
}

type Data = {
  email: string;
  password: string;
};

type resposeLogin = {
  token: string;
};
