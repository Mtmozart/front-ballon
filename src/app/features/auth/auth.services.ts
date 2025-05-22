import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly endpoint = "login";

  private readonly API = "http://localhost:8080/" + this.endpoint;

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }
}
