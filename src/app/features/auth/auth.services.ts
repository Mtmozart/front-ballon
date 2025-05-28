import { Injectable, signal, inject, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, of } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: "root" })
export class AuthService {
  private currentUser = signal<{ id: number; name: string } | null>(null);
  private readonly platformId = inject(PLATFORM_ID);
  public readonly user = this.currentUser.asReadonly();
  private readonly API = "http://localhost:8080/consumers";

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      this.getUserByToken().subscribe();
    }
  }

  login(data: any): Observable<any> {
    return this.http.post(this.API, data).pipe(
      tap((res: any) => {
        this.currentUser.set(res.user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("token", res.token);
        }
      }),
    );
  }

  logout(): void {
    this.currentUser.set(null);
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

  private getUserByToken(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("token");
      if (token) {
        const teste = this.http
          .get(this.API + "/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .pipe(tap((user: any) => this.currentUser.set(user)));
        console.log(teste);
        return teste;
      }
    }

    return of(null);
  }
}
