import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ILogin, ILoginResponse } from "./auth.types";
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
  ngOnInit(): void {
    console.log(this.user);
  }

  get user() {
    const user = this.service.user();
    return user;
  }

  submitForm() {
    const auth: ILogin = {
      email: this.login.email,
      password: this.login.password,
    };
    this.service.login(auth).subscribe((res: ILoginResponse) => {
      const token = res.token;
      console.log("Token:", res);
      localStorage.setItem("token", token);
    });
  }
}
