import { Component, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { QrwcSplMeterComponent } from '../../services/components/qrwc-spl-meter-component';
import { EditableValueComponent } from '../../shared/editable-value/editable-value.component';

@Component({
  selector: 'app-spl',
  imports: [DecimalPipe, EditableValueComponent],
  templateUrl: './spl.component.html',
  styleUrl: './spl.component.scss',
})
export class SplComponent {
  public readonly splMeter = new QrwcSplMeterComponent('SPLMeter');

  // Compute the width of the SPL bar based on the current level.
  public readonly splBarWidth = computed(() => {
    const currentLevel = this.splMeter.level();
    const minLevel = 20;
    const maxLevel = 140;
    const percentage =
      ((currentLevel - minLevel) / (maxLevel - minLevel)) * 100;
    return this.clamp(0, percentage, 100);
  });

  // Small utility to clamp a value between min and max (inclusive)
  private clamp(min: number, value: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
