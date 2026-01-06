import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
   private readonly baseUrl = "https://ballonfinance.com.br";
  // private readonly baseUrl = "http://localhost:8080";
  constructor(private http: HttpClient) {}

  get<T>(
    endpoint: string,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      observe?: "body";
      responseType?: "json";
    },
  ): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options);
  }

  post<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      observe?: "body";
      responseType?: "json";
    },
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }

  put<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      observe?: "body";
      responseType?: "json";
    },
  ): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }

  delete<T>(
    endpoint: string,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      observe?: "body";
      responseType?: "json";
    },
  ): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options);
  }

  patch<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      observe?: "body";
      responseType?: "json";
    },
  ): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }
}
