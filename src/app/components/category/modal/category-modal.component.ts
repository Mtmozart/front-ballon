import { Component, OnInit, Input, Output, EventEmitter, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { DefautModalComponent } from "../../../components/modal/default/default-modal.component";
import { CategoryService } from "../../../category/category.service";
import { Category, CreateCategory, CategoryColor, UpdateCategory, CategoryColorName } from "../../../category/category.types";
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
    MatSelectModule,
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
  editingCategory: Category | null = null;
  userId: string = "";
  
  categoryColorsMap = {
    DEFAULT: "#9E9E9E",
    ITAU_ORANGE: "#EC7000",
    BRADESCO_RED: "#CC092F",
    SANTANDER_RED: "#EA1D25",
    BANCO_DO_BRASIL_YELLOW: "#FFD200",
    CAIXA_BLUE: "#005CA9",
    NUBANK_PURPLE: "#8A05BE",
    INTER_ORANGE: "#FF7A00",
    C6_BLACK: "#000000",
    XP_BLACK: "#111111",
    BTG_BLUE: "#0A1AFF",
    SICREDI_GREEN: "#6DBE45",
    SICOOB_GREEN: "#003641",
    TEAL: "#009688",
    INDIGO: "#3F51B5",
    AMBER: "#FFC107",
    PINK: "#E91E63",
    BROWN: "#795548",
    CYAN: "#00BCD4",
    LIME: "#CDDC39",
    DEEP_PURPLE: "#512DA8",
    BLUE_GRAY: "#607D8B",
  };
  
  categoryColorNames = Object.keys(this.categoryColorsMap) as (keyof typeof this.categoryColorsMap)[];

  private colorHexToName = Object.entries(this.categoryColorsMap).reduce((acc, [name, hex]) => {
    acc[hex] = name;
    return acc;
  }, {} as Record<string, string>);

  constructor() {
    this.categoryForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      color: [CategoryColor.DEFAULT, Validators.required],
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
      this.categoryForm.reset({ color: CategoryColor.DEFAULT });
      this.editingCategory = null;
    }
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.isCreatingNew = true;
    
    const hexColor = this.categoryColorsMap[category.color] || CategoryColor.DEFAULT;
    
    this.categoryForm.patchValue({
      title: category.title,
      color: hexColor,
    });
  }

  createNewCategory() {
    if (this.categoryForm.invalid) return;

    this.isLoading = true;
    const colorHex = this.categoryForm.get('color')?.value;
    const colorName = this.colorHexToName[colorHex] as CategoryColorName || 'DEFAULT';
    const title = this.categoryForm.get('title')?.value;
    
    if (this.editingCategory) {
      const updatedCategory: UpdateCategory = {
        id: this.editingCategory.id,
        title: title,
        color: colorName,
      };
      
      this.categoryService.update(updatedCategory).subscribe({
        next: () => {
          this.categoryForm.reset({ color: CategoryColor.DEFAULT });
          this.isCreatingNew = false;
          this.editingCategory = null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Erro ao atualizar categoria:", error);
          this.isLoading = false;
        },
      });
    } else {
      const newCategory: CreateCategory = {
        title: title,
        color: colorName,
      };

      this.categoryService.create(newCategory).subscribe({
        next: () => {
          this.categoryForm.reset({ color: CategoryColor.DEFAULT });
          this.isCreatingNew = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Erro ao criar categoria:", error);
          this.isLoading = false;
        },
      });
    }
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
    this.editingCategory = null;
    this.categoryForm.reset({ color: CategoryColor.DEFAULT });
    this.close.emit();
  }
}
