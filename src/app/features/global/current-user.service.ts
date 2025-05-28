import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalContextService {
  private _username = signal<string | null>(null);

  username = this._username.asReadonly();

  setUsername(name: string) {
    this._username.set(name);
  }

  clearUsername() {
    this._username.set(null);
  }
}
