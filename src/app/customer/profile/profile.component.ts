// profile.component.ts
import { Component, inject } from "@angular/core";
import { AuthService } from "../../features/auth/auth.services";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  authService = inject(AuthService);
}
