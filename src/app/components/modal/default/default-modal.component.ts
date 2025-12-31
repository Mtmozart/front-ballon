import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

type Size = "h1" | "h2" | "h3" | "h4" | "h5";

@Component({
  selector: "app-title",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./default-modal.component.html",
  styleUrls: ["./default-modal.component.css"],
})
export class TitleComponent {
  @Input({ required: true }) size: Size = "h1";
  @Input() title?: string;

  get cssClass(): string {
    return `title-${this.size}`;
  }
}
