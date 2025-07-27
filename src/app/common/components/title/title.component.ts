import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

type Size = "h1" | "h2" | "h3" | "h4" | "h5";

@Component({
  selector: "app-title",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./title.component.html",
  styleUrls: ["./title.component.css"],
})
export class TitleComponent {
  @Input({ required: true }) size: Size = "h1";
  @Input() title?: string;

  get cssClass(): string {
    return `title-${this.size}`;
  }
}
