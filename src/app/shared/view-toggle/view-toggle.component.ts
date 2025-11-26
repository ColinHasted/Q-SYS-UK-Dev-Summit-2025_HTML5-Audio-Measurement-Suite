import { Component, input, output } from '@angular/core';


@Component({
  selector: 'app-view-toggle',
  standalone: true,
  imports: [],
  template: `
    <div class="view-toggle">
      <div class="toggle-switch">
        <input
          type="checkbox"
          id="viewToggle"
          class="toggle-input"
          [checked]="checked()"
          (change)="onChange($event)"
        />
        <label for="viewToggle" class="toggle-label">
          <div class="toggle-track">
            <div class="toggle-slider"></div>
            <span class="toggle-text off-text">RTA</span>
            <span class="toggle-text on-text">MAG</span>
          </div>
        </label>
      </div>
    </div>
  `,
  styles: [
    `
      .view-toggle .toggle-switch {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }
      .view-toggle .toggle-input {
        display: none;
      }
      .view-toggle .toggle-label {
        cursor: pointer;
        user-select: none;
      }
      .view-toggle .toggle-track {
        position: relative;
        display: flex;
        align-items: center;
        width: 4rem;
        height: 1.2rem;
        background: #1a1a1a;
        border: 0.0625rem solid #333;
        border-radius: 0.125rem;
        transition: all 0.3s ease;
        overflow: hidden;
        box-shadow: inset 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.8),
          inset 0 -0.0625rem 0.125rem rgba(255, 255, 255, 0.05);
      }
      .view-toggle .toggle-slider {
        position: absolute;
        top: 0.0625rem;
        left: 0.0625rem;
        width: calc(50% - 0.0625rem);
        height: calc(100% - 0.125rem);
        background: linear-gradient(145deg, #454545, #2a2a2a, #1a1a1a);
        border-radius: 0.0625rem;
        transition: all 0.3s ease;
        z-index: 2;
        box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.6),
          0 0.03125rem 0.09375rem rgba(0, 0, 0, 0.4),
          inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.15),
          inset 0 -0.03125rem 0.0625rem rgba(0, 0, 0, 0.3);
        border: 0.03125rem solid #555;
      }
      .view-toggle .toggle-text {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.5rem;
        font-weight: 600;
        z-index: 1;
        transition: opacity 0.3s ease;
        color: #eee;
      }
      .view-toggle .off-text {
        left: 0.25rem;
      }
      .view-toggle .on-text {
        right: 0.25rem;
      }
      .view-toggle .toggle-input:checked + .toggle-label .toggle-track {
        background: #1a1a1a;
        border-color: #333;
      }
      .view-toggle
        .toggle-input:checked
        + .toggle-label
        .toggle-track
        .toggle-slider {
        transform: translateX(calc(100% + 0.0625rem));
        background: linear-gradient(145deg, #454545, #2a2a2a, #1a1a1a);
      }
      .view-toggle .toggle-input:checked + .toggle-label .off-text {
        opacity: 0.4;
      }
      .view-toggle .toggle-input:checked + .toggle-label .on-text {
        opacity: 1;
      }
      .view-toggle .toggle-input:not(:checked) + .toggle-label .off-text {
        opacity: 1;
      }
      .view-toggle .toggle-input:not(:checked) + .toggle-label .on-text {
        opacity: 0.4;
      }
    `,
  ],
})

export class ViewToggleComponent {
  checked = input<boolean>(false);
  checkedChange = output<boolean>();

  onChange(event: Event) {
    const el = event.target as HTMLInputElement;
    this.checkedChange.emit(el.checked);
  }
}
