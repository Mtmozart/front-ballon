import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomerService } from "../customer.service";
import { Consumer } from "../customer.types";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";

interface IRegisterForm {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
}

@Component({
  selector: "app-register-consumer",
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterConsumerComponent {
  registerForm!: FormGroup<IRegisterForm>;

  constructor(
    private service: CustomerService,
    private toastService: ToastrService,
    private router: Router,
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      passwordConfirm: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  submit() {
    const newCustomer: Consumer = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      createAt: new Date(),
    };
  }
  navigate() {
    this.router.navigate(["login"]);
  }
}
