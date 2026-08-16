import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "krds-masthead",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div [id]="id">
      <div class="toggle-wrap">
        <div class="toggle-head">
          <div class="inner">
            <span class="nuri-txt">{{ message }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class KrdsMastheadComponent {
  @Input() id = "krds-masthead";
  @Input() message = "도움말";
}

@Component({
  selector: "krds-identifier",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div class="krds-identifier">
      <span class="logo">
        <span class="sr-only">KRDS - Korea Design System</span>
      </span>
      <span class="ban-txt">{{ description || organization }}</span>
    </div>
  `,
})
export class KrdsIdentifierComponent {
  @Input() description = "";
  @Input() organization = "KRDS Community";
}
