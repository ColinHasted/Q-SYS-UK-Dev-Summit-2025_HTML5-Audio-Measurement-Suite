import { Component, computed, input } from '@angular/core';
import { EditableValueComponent } from '../../shared/editable-value/editable-value.component';
import { Qrwc } from '@q-sys/qrwc';
import { QrwcResponsalyzerComponent } from '../../services/components/qrwc-responsalyzer-component';

@Component({
  selector: 'app-delay',
  imports: [EditableValueComponent],
  templateUrl: './delay.component.html',
  styleUrl: './delay.component.scss'
})
export class DelayComponent {

  readonly responsalyzerComponent = input.required<QrwcResponsalyzerComponent>();
  public delayValue = 2.5; // Default delay value in ms

  delay = computed(() => 1000 * this.responsalyzerComponent().delay());

  setDelay(value: number) {
    this.responsalyzerComponent().setDelay(value / 1000);

    console.log('Delay changed to:', value);
  }

  onAutoSet() {
    this.responsalyzerComponent().autoSetDelay();
  }
}
