import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.services";

@Injectable({
  providedIn: "root",
})
export class PlubicGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      return true; 
    } else {
      this.router.navigate(["/profile"]); 
      return false; 
    }
  }
}
