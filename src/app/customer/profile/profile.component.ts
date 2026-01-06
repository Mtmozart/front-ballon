import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { AuthService } from "../../features/auth/auth.services";
import { TitleComponent } from "../../common/components/title/title.component";
import { LoadingComponent } from "../../common/components/loading/loading.componet";
import { DefautModalComponent } from "../../components/modal/default/default-modal.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { Consumer, ConsumerResponse, UpdateConsumer } from "../customer.types";
import { CustomerService } from "../customer.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleComponent,
    LoadingComponent,
    DefautModalComponent,
    PrimaryInputComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private customerService = inject(CustomerService);
  readonly loading = this.authService.loading;
  readonly user = signal<ConsumerResponse | null>(null);
  readonly isEditing = signal(false);
  
  isModalOpen = false;

  verificationForm = new FormGroup({
    verificationCode: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  profileForm = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.email,
    ]),
    passowrd: new FormControl("", [
      Validators.required,
    ]),
    cell_phone: new FormControl("", [
      Validators.minLength(10),
    ]),
  });

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.authService.getUserByToken().subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(["/auth"]);
          return;
        }

        this.user.set(user);

        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          cell_phone: user.cell_phone ?? "",
        });
      },
      error: () => {
        this.toast.error("Usuário não autorizado.");
        this.router.navigate(["/auth"]);
      },
    });
  }

  enableEdit() {
    this.isEditing.set(true);
  }

  cancelEdit() {
    const user = this.user();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        cell_phone: user.cell_phone ?? "",
      });
    }
    this.isEditing.set(false);
  }

saveProfile() {
  if (this.profileForm.invalid) {
    this.toast.error("Formulário inválido.");
    return;
  }

  const token = this.authService.getToken();
  if (!token) {
    this.toast.error("Usuário não autenticado.");
    return;
  }

  const customerUpdate: UpdateConsumer = {
    name: this.profileForm.value.name!,
    email: this.profileForm.value.email!,
    password: this.profileForm.value.passowrd!,
    cellNumber: this.profileForm.value.cell_phone ?? undefined,
  };

  this.customerService.update(customerUpdate, token).subscribe({
    next: () => {
      this.toast.success("Perfil atualizado com sucesso.");
      this.isEditing.set(false);
      this.loadCurrentUser();
    },
    error: () => {
      this.toast.error("Erro ao atualizar perfil.");
    },
  });
}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  sendCodeVerificationByEmail() {
    const token = this.authService.getToken();
    if (!token) return;

    this.customerService.generateCodeToValidadeAccount(token).subscribe({
      next: () => {
        this.toast.success("Código enviado via e-mail.");
      },
      error: () => {
        this.toast.error("Erro ao enviar o e-mail.");
      },
    });
  }

  submitVerification() {
    const token = this.authService.getToken();
    const code = this.verificationForm.get("verificationCode")?.value;

    if (!code) {
      this.toast.error("Informe o código de verificação.");
      return;
    }

    if (!token) return;

    this.customerService.validateCode(token, code).subscribe({
      next: () => {
        this.toast.success("Conta validada com sucesso.");
        this.isModalOpen = false;
        this.loadCurrentUser();
      },
      error: () => {
        this.toast.error("Erro ao validar sua conta.");
      },
    });
  }
}
