import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { SelectOptions } from "./select.types";
import { CommonModule } from "@angular/common";

type InputTypes = "text" | "email" | "password";

@Component({
  selector: "app-select",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  templateUrl: "./select.component.html",
  styleUrl: "./select.component.css",
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = "";
  @Input() options: SelectOptions[] = [];
  @Input() placeholder: string = "";
  @Input() disabled: boolean = false;

  value: any;
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  onSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
