import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Consumer, CreateConsumer } from "./customer.types";
import { ApiService } from "../api/api.service";
@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private readonly endpoint = "consumers";

  constructor(
    private apiService: ApiService,
  ) {}

  register(customer: CreateConsumer): Observable<Consumer> {
    return this.apiService.post(this.endpoint, customer);
  }

  getById(id: string): Observable<Consumer> {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }

  update(id: string, customer: Consumer): Observable<Consumer> {
    return this.apiService.put<Consumer>(`${this.endpoint}/${id}`, customer);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
