import { Component, Input, Output, EventEmitter, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CategoryModalComponent } from "../modal/category-modal.component";
import { CategoryService } from "../../../category/category.service";
import { Category } from "../../../category/category.types";

@Component({
  selector: "category-select",
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, CategoryModalComponent],
  templateUrl: "./category-select.component.html",
  styleUrls: ["./category-select.component.css"],
})
export class CategorySelectComponent implements OnInit {
  @Input() selectedCategory: Category | null = null;
  @Output() categoryChange = new EventEmitter<Category>();

  private categoryService = inject(CategoryService);
  showCategoryModal = false;

  ngOnInit() {
    console.log('CategorySelectComponent iniciado');
    this.loadCategories();
    
    this.categoryService.reloadCategories$.subscribe(() => {
      console.log('Categorias recarregadas');
      this.loadCategories();
    });
  }

  loadCategories() {
     this.categoryService.findAllByUserId().subscribe({
        next: () => {
        },
        error: (error: any) => {
          console.error("Erro ao carregar categorias:", error);
        },
      });
    
  }

  openCategoryModal() {
    this.showCategoryModal = true;
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
  }

  onCategorySelected(category: Category) {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  clearSelection() {
    this.selectedCategory = null;
    this.categoryChange.emit(null as any);
  }
}
