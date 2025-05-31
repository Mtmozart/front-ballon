import { Injectable, signal, inject, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, of } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { ApiService } from "../../api/api.service";
import { Consumer } from "../../customer/customer.types";

@Injectable({ providedIn: "root" })
export class AuthService {
  private currentUser = signal<{ user: Consumer } | null>(null);
  private readonly platformId = inject(PLATFORM_ID);
  public readonly user = this.currentUser.asReadonly();

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  login(data: any): Observable<any> {
    return this.apiService.post("login", data).pipe(
      tap((res: any) => {
        this.currentUser.set(res.user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("token", res.token);
        }
      }),
    );
  }

  /*  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
    }
  }
  */

  public isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("token");
    }
    return false;
  }

  private getUserByToken(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("token");
      if (token) {
        const teste = this.apiService
          .get("consumers/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .pipe(tap((user: any) => this.currentUser.set(user)));
        return teste;
      }
    }
    return of(null);
  }
}
