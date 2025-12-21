import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../features/auth/auth.services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TitleComponent } from "../../common/components/title/title.component";
import { LoadingComponent } from "../../common/components/loading/loading.componet";
import { ConsumerResponse } from "../customer.types";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, TitleComponent, LoadingComponent],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  readonly loading = this.authService.loading; 

  readonly user = signal<ConsumerResponse | null>(null);

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.authService.getUserByToken().subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: () => {
        this.toast.error("Usuário não autorizado.");
        this.router.navigate(["/auth"]);
      }
    });
  }
}
