import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ILogin } from "./auth.types";
import { AuthService } from "./auth.services";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent {
  login = {
    email: "",
    password: "",
  };

  constructor(private service: AuthService) {}

  submitForm() {
    const auth: ILogin = {
      email: this.login.email,
      password: this.login.password,
    };
    this.service.login(auth).subscribe((res) => {
      console.log("Token:", res);
    });
  }
}
