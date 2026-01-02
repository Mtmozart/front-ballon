import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { AuthService } from "../../features/auth/auth.services";
import { TitleComponent } from "../../common/components/title/title.component";
import { LoadingComponent } from "../../common/components/loading/loading.componet";
import { DefautModalComponent } from "../../components/modal/default/default-modal.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { ConsumerResponse } from "../customer.types";
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
    PrimaryInputComponent
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private readonly customerService= inject(CustomerService)

  isModalOpen = false;

  verificationForm = new FormGroup({
    verificationCode: new FormControl('')
  });

  readonly loading = this.authService.loading;
  readonly user = signal<ConsumerResponse | null>(null);

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.authService.getUserByToken().subscribe({
      next: (user) => this.user.set(user),
      error: () => {
        this.toast.error("Usuário não autorizado.");
        this.router.navigate(["/auth"]);
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitVerification() {
    const token = this.authService.getToken()
    if(token) {
      this.customerService.generateCodeToValidadeAccount(token).subscribe({
        next: () => {
          this.toast.success("Código enviado via e-mail.")          
        },
        error: () => {
        this.toast.error("Erro ao enviar o e-mail.");
        }
      })
    }
  }
}
