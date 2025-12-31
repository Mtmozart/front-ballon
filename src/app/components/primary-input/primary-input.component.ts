import { NgIf } from "@angular/common";
import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";

type InputTypes = "text" | "email" | "password" | "number";

@Component({
  selector: "app-primary-input",
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true,
    },
    provideNgxMask(),
  ],
  templateUrl: "./primary-input.component.html",
  styleUrls: ["./primary-input.component.css"],
})
export class PrimaryInputComponent implements ControlValueAccessor {
  @Input() type: InputTypes = "text";
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() inputName: string = "";

  // Máscaras e opções opcionais
  @Input() maxLength?: number;
  @Input() mask?: string;
  @Input() decimalMarker: "." | "," | [".", ","] = ",";
  @Input() thousandSeparator: "." | "," = ".";
  @Input() prefix: string = "";

  value: string = "";
  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

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
    // Implementar se precisar desativar o input
  }
}
