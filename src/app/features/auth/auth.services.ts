import { Injectable, signal, inject, PLATFORM_ID } from "@angular/core";
import { Observable, tap, of, finalize, catchError } from "rxjs";
import { ApiService } from "../../api/api.service";
import { ConsumerResponse } from "../../customer/customer.types";
import { Token } from "./auth.types";
import { isPlatformBrowser } from "@angular/common";



@Injectable({ providedIn: "root" })
export class AuthService {
  private currentUser = signal<ConsumerResponse | null>(null);
  public readonly user = this.currentUser.asReadonly();
  public loading = signal(false);
  public platformId = inject(PLATFORM_ID);

  constructor(private apiService: ApiService) {}

  login(email: string, password: string): Observable<Token> {
    const data = {
      email,
      password,
    };
    return this.apiService.post("login", data);
  }

   logout(): void {
    this.currentUser.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
    }
  }
  public isLoggedIn(): boolean {
  if (!isPlatformBrowser(this.platformId)) {
    return false;
  }

  return !!localStorage.getItem("token");
}


 public getUserByToken(): Observable<ConsumerResponse | null> {
  this.loading.set(true);

  if (!isPlatformBrowser(this.platformId)) {
    return of(null);
  }

  const token = localStorage.getItem("token");

  if (!token) {
    this.currentUser.set(null);
    return of(null);
  }

  return this.apiService
    .get<ConsumerResponse>("consumers/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .pipe(
      tap((user) => this.currentUser.set(user)),

      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem("token");
          this.currentUser.set(null);
        }
        return of(null);
      }),

      finalize(() => this.loading.set(false))
    );
}

    public getToken(): string | null {    
    return localStorage.getItem("token");
  }
}
