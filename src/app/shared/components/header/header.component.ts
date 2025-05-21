import { Component, Inject, PLATFORM_ID, afterNextRender } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  faMoon = faMoon;
  faSun = faSun;
  isDarkMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.isDarkMode = document.body.classList.contains("dark-theme");
      }
    });
  }

  toggle() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle("dark-theme");
      this.isDarkMode = !this.isDarkMode;
    }
  }
}
