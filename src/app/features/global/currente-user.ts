import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Consumer } from "../../customer/customer.types";

@Injectable({ providedIn: "root" })
export class UserContextService {
  private userSubject = new BehaviorSubject<Consumer | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(consumer: Consumer) {
    this.userSubject.next(consumer);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  get currentUser(): Consumer | null {
    return this.userSubject.getValue();
  }
}
