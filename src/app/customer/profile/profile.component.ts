import { Component, inject, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../features/auth/auth.services";
import { Route, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  authService = inject(AuthService);
  constructor(
    private router: Router,
    private toastService: ToastrService,
  ) {
    effect(() => {
      const user = this.authService.user();
      if (!user) {
        toastService.error("Usuário sem autorização.");
        this.router.navigate(["/auth"]);
      }
    });
  }
}
