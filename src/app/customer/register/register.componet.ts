import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomerService } from "../customer.service";
import { Consumer, CreateConsumer } from "../customer.types";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { NgIf } from "@angular/common";
import { LoadingComponent } from "../../common/components/loading/loading.componet";
import { finalize } from 'rxjs/operators';

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
})
export class RegisterConsumerComponent {
  registerForm!: FormGroup<IRegisterForm>;
  public loading = false
  constructor(
    private service: CustomerService,
    private toastService: ToastrService,
    private router: Router,
    
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
  submit() {
    this.loading = true
    const newCustomer: CreateConsumer = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.toastService.info("Criando usuário.");

    this.service.register(newCustomer)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe({
      next: () => {
        this.toastService.success("Usuário criado com sucesso.");
        this.navigate();
      },
      error: (err) => {
        console.error("Erro:", err);
        this.toastService.error("Erro ao criar o usuário.");
      },
    });
  }

  navigate() {
    this.router.navigate(["/auth"]);
  }
}
