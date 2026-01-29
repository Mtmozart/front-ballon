import { Component, OnInit, Input, Output, EventEmitter, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DefautModalComponent } from "../../../components/modal/default/default-modal.component";
import { CategoryService } from "../../../category/category.service";
import { Category, CreateCategory } from "../../../category/category.types";
import { TitleComponent } from "../../../common/components/title/title.component";

@Component({
  selector: "category-modal",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DefautModalComponent,
    TitleComponent,
  ],
  templateUrl: "./category-modal.component.html",
  styleUrls: ["./category-modal.component.css"],
})
export class CategoryModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<Category>();

  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categoryForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isCreatingNew = false;
  userId: string = "";

  constructor() {
    this.categoryForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
  }

  ngOnInit() {
    this.loadUserCategories();
    this.categoryService.reloadCategories$.subscribe(() => {
      this.loadUserCategories();
    });
  }

  loadUserCategories() {
      this.categoryService.findAllByUserId().subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (error) => {
          console.error("Erro ao carregar categorias:", error);
        },
      });
   
  }

  toggleCreateNew() {
    this.isCreatingNew = !this.isCreatingNew;
    if (!this.isCreatingNew) {
      this.categoryForm.reset();
    }
  }

  createNewCategory() {
    if (this.categoryForm.invalid) return;

    this.isLoading = true;
    const newCategory: CreateCategory = this.categoryForm.value;

    this.categoryService.create(newCategory).subscribe({
      next: () => {
        this.categoryForm.reset();
        this.isCreatingNew = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao criar categoria:", error);
        this.isLoading = false;
      },
    });
  }

  selectCategory(category: Category) {
    this.categorySelected.emit(category);
    this.closeModal();
  }

  deleteCategory(categoryId: number) {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      this.categoryService.delete(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter((c) => c.id !== categoryId);
        },
        error: (error) => {
          console.error("Erro ao deletar categoria:", error);
        },
      });
    }
  }

  closeModal() {
    this.isCreatingNew = false;
    this.categoryForm.reset();
    this.close.emit();
  }
}
