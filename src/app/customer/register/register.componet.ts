import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomerService } from "../customer.service";
import { Consumer } from "../customer.types";

@Component({
  selector: "app-register-consumer",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterConsumerComponent implements OnInit {
  consumer = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  constructor(private service: CustomerService) {}

  ngOnInit(): void {}

  submitForm() {
    if (this.consumer.password !== this.consumer.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    const newCustomer: Consumer = {
      name: this.consumer.name,
      email: this.consumer.email,
      password: this.consumer.password,
      createAt: new Date(),
    };
    this.service.register(newCustomer).subscribe((res) => {
      console.log("Cliente registrado:", res);
    });
  }
}
