import { Component, input, output, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editable-value',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="editable-container">
      <div class="value-input-wrapper">
        <input
          type="number"
          class="value-input"
          [value]="displayValue()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (keydown.enter)="onEnter($event)"
          [step]="step()"
          [min]="min()"
          [max]="max()"
          #inputElement
        />
        <span class="value-unit">{{ displayUnit() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .editable-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      user-select: none;
    }

    .editable-label {
      font-size: 0.5625rem;
      color: #ccc;
      text-align: center;
      font-weight: 500;
    }

    .value-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .value-input {
      width: 3.9rem;
      height: 1.5rem;
      background: #1a1a1a;
      border: 0.0625rem solid #333;
      border-radius: 0.25rem;
      color: #0ac8ff;
      font-family: 'Courier New', monospace;
      font-size: 0.6875rem;
      font-weight: 600;
      text-align: center;
      padding: 0 0.375rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #0ac8ff;
        box-shadow: 0 0 0.5rem rgba(10, 200, 255, 0.3);
        background: #1f2937;
      }

      &:hover:not(:focus) {
        border-color: #555;
      }

      /* Webkit spinner styling */
      &::-webkit-inner-spin-button {
        -webkit-appearance: inner-spin-button;
        width: 0.875rem;
        background: #1f2937;
        color:yellow
      }

      &:focus::-webkit-outer-spin-button,
   {
      color:red;
        background: #1f2937;
      }

    }

    .value-unit {
      position: absolute;
      right: 0.375rem;
      font-size: 0.5rem;
      color: #666;
      pointer-events: none;
      font-weight: 500;
    }
  `]
})
export class EditableValueComponent {
  label = input<string>('');
  value = input<number>(0);
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(0.1);
  unit = input<string>('');
  decimals = input<number>(1);
  mode = input<'db' | 'time'>('db'); // New mode input

  valueChange = output<number>();

  private tempValue = signal<string>('');

  // Computed display value based on mode
  displayValue = computed(() => {
    if (this.tempValue()) {
      return this.tempValue();
    }

    const val = this.value();

    if (this.mode() === 'time') {
      // Time mode: ms for < 1s, seconds with 1 decimal for >= 1s
      if (val < 1) {
        return Math.round(val * 1000).toString(); // Convert to ms, whole number
      } else {
        return val.toFixed(1); // Seconds with 1 decimal
      }
    } else {
      // dB mode: use specified decimals (default 1)
      return val.toFixed(this.decimals());
    }
  });

  // Computed unit display based on mode and value
  displayUnit = computed(() => {
    if (this.mode() === 'time') {
      return this.value() < 1 ? 'ms' : 's';
    }
    return this.unit();
  });

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.tempValue.set(target.value);
  }

  onBlur() {
    this.commitValue();
  }

  onEnter(event: Event) {
    const target = event.target as HTMLInputElement;
    target.blur();
  }

  private commitValue() {
    let inputValue = parseFloat(this.tempValue());
    if (isNaN(inputValue)) {
      this.tempValue.set('');
      return;
    }

    // Convert input based on mode
    if (this.mode() === 'time') {
      // If the current display is in ms (value < 1s), convert ms input to seconds
      if (this.value() < 1) {
        inputValue = inputValue / 1000; // Convert ms to seconds
      }
      // If current display is in seconds, input is already in seconds
    }

    const clampedValue = Math.max(this.min(), Math.min(this.max(), inputValue));
    const steppedValue = Math.round(clampedValue / this.step()) * this.step();

    // Round to appropriate precision based on mode
    let roundedValue: number;
    if (this.mode() === 'time') {
      // For time, always store in seconds with sufficient precision
      roundedValue = parseFloat(steppedValue.toFixed(6));
    } else {
      // For dB, use specified decimal places
      roundedValue = parseFloat(steppedValue.toFixed(this.decimals()));
    }

    this.valueChange.emit(roundedValue);
    this.tempValue.set('');
  }
}
