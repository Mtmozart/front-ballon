import { Injectable, inject } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { ApiService } from "../api/api.service";
import { Category, CreateCategory, UpdateCategory } from "./category.types";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = "category";

  private reloadCategoriesSource = new Subject<void>();
  reloadCategories$ = this.reloadCategoriesSource.asObservable();

  findAllByUserId(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.endpoint);
  }

  findOneById(categoryId: number): Observable<Category> {
    const route = `${this.endpoint}/${categoryId}`;
    return this.apiService.get<Category>(route);
  }

  create(category: CreateCategory): Observable<void> {
    return this.apiService
      .post<void>(this.endpoint, category)
      .pipe(tap(() => this.reloadCategoriesSource.next()));
  }

  update(updateCategory: UpdateCategory): Observable<void> {
    return this.apiService
      .put<void>(this.endpoint, updateCategory)
      .pipe(tap(() => this.reloadCategoriesSource.next()));
  }

  delete(categoryId: number): Observable<void> {
    const route = `${this.endpoint}/${categoryId}`;
    return this.apiService
      .delete<void>(route)
      .pipe(tap(() => this.reloadCategoriesSource.next()));
  }
}
