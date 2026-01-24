import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Consumer, CreateConsumer, UpdateConsumer } from "./customer.types";
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

 getById(): Observable<Consumer> {
  return this.apiService.get(`${this.endpoint}`);
  }

  update(customer: UpdateConsumer): Observable<Consumer> {
  return this.apiService.put<Consumer>(
    `${this.endpoint}`,
    customer,
  );
}


  delete(): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}`);
  }
  //TODO: MUDAR PARA GET
  generateCodeToValidadeAccount(): Observable<void> {
    return this.apiService.put(
      `${this.endpoint}/generate-new-code`,
      {}
    );
  }

  validateCode(code: string): Observable<void> {
    return this.apiService.put(
      `${this.endpoint}/validate`,
      {code}
    );
  }

}
