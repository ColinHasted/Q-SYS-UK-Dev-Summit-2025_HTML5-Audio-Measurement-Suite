import { Component } from '@angular/core';
import { QrwcPinkNoiseComponent } from '../../services/components/qrwc-pink-noise-component';
import { EditableValueComponent } from '../../shared/editable-value/editable-value.component';
import { PinkToggleComponent } from './pink-toggle/pink-toggle.component';

@Component({
  selector: 'app-pink-noise',
  imports: [EditableValueComponent, PinkToggleComponent],
  templateUrl: './pink-noise.component.html',
  styleUrl: './pink-noise.component.scss'
})
export class PinkNoiseComponent {
  readonly pinkNoiseComponent = new QrwcPinkNoiseComponent('Pink_Noise_Generator');

  onMuteToggle() {
    this.pinkNoiseComponent.toggleMute();
  }

  onLevelChange(level: number) {
    this.pinkNoiseComponent.setLevel(level);
  }
}
