import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AuthService } from "./features/auth/auth.services";
import { FooterComponent } from "./common/components/footer/footer.component";
import { HeaderComponent } from "./common/components/header/header.component";


@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FontAwesomeModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "ballon";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserByToken().subscribe();
  }
}
