import {
  Component,
  Inject,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
} from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { AuthService } from "../../../features/auth/auth.services";
import { ToastrService } from "ngx-toastr";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [FaIconComponent, CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  faMoon = faMoon;
  faSun = faSun;
  isDarkMode = false;
  authService = inject(AuthService);
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastService: ToastrService,
    private router: Router,
  ) {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.isDarkMode = document.body.classList.contains("dark-theme");
      }
    });
    effect(() => {
      this.authService.user();
    });
  }
  toggle() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle("dark-theme");
      this.isDarkMode = !this.isDarkMode;
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/auth"]);
    this.toastService.success("Logout feito com sucesso");
  }
}
