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

 getById(token: string): Observable<Consumer> {
  return this.apiService.get(`${this.endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  }

  update(customer: Consumer, token: string): Observable<Consumer> {
    return this.apiService.put<Consumer>(
      `${this.endpoint}`,
      customer,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  delete(token: string): Observable<void> {
    return this.apiService.delete<void>(
      `${this.endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  //TODO: MUDAR PARA GET
  generateCodeToValidadeAccount(token: string): Observable<void> {
    return this.apiService.put(
      `${this.endpoint}/generate-new-code`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  validateCode(token: string, code: string): Observable<void> {
    return this.apiService.put(
      `${this.endpoint}/validate`,
      {code}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

}
