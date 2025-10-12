import { Component, computed, input } from '@angular/core';
import { EditableValueComponent } from '../../shared/editable-value/editable-value.component';
import { QrwcResponsalyzerComponent } from '../../services/components/qrwc-responsalyzer-component';

@Component({
  selector: 'app-gain',
  imports: [ EditableValueComponent],
  templateUrl: './gain.component.html',
  styleUrl: './gain.component.scss'
})
export class GainComponent {

  readonly responsalyzerComponent = input.required<QrwcResponsalyzerComponent>();


}
