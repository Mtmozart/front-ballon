import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AuthService } from "./features/auth/auth.services";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FontAwesomeModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "ballon";
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    console.log("aqui");
    const test = this.authService["getUserByToken"]().subscribe();
    console.log(test);
  }
}
