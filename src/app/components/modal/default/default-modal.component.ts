import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TitleComponent } from "../../../common/components/title/title.component";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "default-modal",
  standalone: true,
  imports: [CommonModule, TitleComponent, MatIconModule],
  templateUrl: "./default-modal.component.html",
  styleUrls: ["./default-modal.component.css"],
})
export class DefautModalComponent {
  @Input() title!: string;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
