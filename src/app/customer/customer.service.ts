import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateConsumer, Consumer } from "./customer.types";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private readonly endpoint = "customers";

  private readonly API = "http://localhost:8080/consumers";
  constructor(private http: HttpClient) {}

  register(customer: any): Observable<any> {
    return this.http.post(this.API, customer);
  }

  /* getAll(): Observable<Consumer[]> {
    return this.api.get<Consumer[]>(this.endpoint);
  }

  getById(id: string): Observable<Consumer> {
    return this.api.get<Consumer>(`${this.endpoint}/${id}`);
  }

  update(id: string, customer: Consumer): Observable<Consumer> {
    return this.api.put<Consumer>(`${this.endpoint}/${id}`, customer);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
    }*/
}
