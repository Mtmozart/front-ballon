import { Component, inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomerService } from "../customer.service";
import { CreateConsumer } from "../customer.types";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { NgIf } from "@angular/common";
import { LoadingComponent } from "../../common/components/loading/loading.componet";
import { AuthService } from "../../features/auth/auth.services";

interface IRegisterForm {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
}
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get("password")?.value;
  const passwordConfirm = control.get("passwordConfirm")?.value;
  if (!password) return null;

  if (
    password.length < 6 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password)
  ) {
    return { passwordWeak: true };
  }
  if (password && passwordConfirm && password !== passwordConfirm) {
    return { passwordMismatch: true };
  }
  return null;
};

export const passwordStrength: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get("password")?.value;
  if (!password) return null;

  if (
    password.length < 6 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password)
  ) {
    return { passwordWeak: true };
  }
  return null;
};

@Component({
  selector: "app-register-consumer",
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    NgIf,
    LoadingComponent
  ],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  providers: [CustomerService]
})
export class RegisterConsumerComponent implements OnInit{
  private service = inject(CustomerService);
  private toastService = inject(ToastrService);
  private router = inject(Router);
  private authService = inject(AuthService)
  public accessToken!: string;

  registerForm!: FormGroup<IRegisterForm>;
  public loading = false
  constructor(
  ) {
    this.registerForm = new FormGroup(
      {
        name: new FormControl("", [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
        passwordConfirm: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      { validators: passwordMatchValidator },
    );
  }
  ngOnInit(): void {
     this.authService.getUserByToken().subscribe(user => {
      if (user) {
        this.router.navigate(["profile"]);
      }
  });
  }
  submit() {
  this.loading = true;

  const newCustomer: CreateConsumer = {
    name: this.registerForm.value.name!,
    email: this.registerForm.value.email!,
    password: this.registerForm.value.password!,
  };

  this.toastService.info("Criando usuário.");

  this.service.register(newCustomer).subscribe({
    next: () => {
      this.toastService.success("Usuário criado com sucesso.");
      this.navigate();
    },
    error: () => {
      this.toastService.error("Erro ao criar o usuário.");
    },
    complete: () => {
      this.loading = false;
    }
  });
}
  navigate() {
    this.router.navigate(["/auth"]);
  }
}
