import { Component, inject, signal, computed, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../features/auth/auth.services";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TitleComponent } from "../../common/components/title/title.component";
import { LoadingComponent } from "../../common/components/loading/loading.componet";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, TitleComponent, LoadingComponent],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly loading = this.authService.loading; 
  private toast = inject(ToastrService);
  readonly user = this.authService.user;

  constructor() {
    effect(() => {
      this.getCurrentUser();
    });
  }

  private getCurrentUser() {
    const user = this.user();
    if (!user && !this.loading()) {
      this.toast.error("Usuário não autorizado.");
      this.router.navigate(["/auth"]);
    }
  }
}
