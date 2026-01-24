import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AuthService } from "./features/auth/auth.services";
import { FooterComponent } from "./common/components/footer/footer.component";
import { HeaderComponent } from "./common/components/header/header.component";
import { LoadingComponent } from "./common/components/loading/loading.componet";


@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FontAwesomeModule, LoadingComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "ballon";

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.authService.getUserByToken().subscribe();
    }
  }
}
