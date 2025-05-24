import { HttpClient } from "@angular/common/http";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly endpoint = "login";
  private readonly API = "http://localhost:8080/" + this.endpoint;

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("token");
    }
    return false;
  }
}
