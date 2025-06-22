import { Injectable, signal, inject, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, of } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { ApiService } from "../../api/api.service";
import { ConsumerResponse } from "../../customer/customer.types";

type token = {
  token: string;
};
@Injectable({ providedIn: "root" })
export class AuthService {
  private currentUser = signal<{ user: ConsumerResponse | null }>({
    user: null,
  });
  private readonly platformId = inject(PLATFORM_ID);
  public readonly user = this.currentUser.asReadonly();

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  login(email: string, password: string): Observable<token> {
    const data = {
      email,
      password,
    };
    return this.apiService.post("login", data);
  }

  logout(): void {
    this.currentUser.set({ user: null });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
    }
  }

  public isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("token");
    }
    return false;
  }

  public getUserByToken(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("token");
      if (token) {
        const teste = this.apiService
          .get<ConsumerResponse>("consumers/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .pipe(
            tap((user: ConsumerResponse) => this.currentUser.set({ user })),
          );
        return teste;
      }
    }
    return of(null);
  }
}
