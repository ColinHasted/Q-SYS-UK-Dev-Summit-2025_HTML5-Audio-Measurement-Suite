import { Component, input } from '@angular/core';
import { EditableValueComponent } from '../../shared/editable-value/editable-value.component';
import { QrwcResponsalyzerComponent } from '../../services/components/qrwc-responsalyzer-component';

@Component({
  selector: 'app-averaging',
  imports: [EditableValueComponent],
  templateUrl: './averaging.component.html',
  styleUrl: './averaging.component.scss'
})
export class AveragingComponent {
    readonly responsalyzerComponent = input.required<QrwcResponsalyzerComponent>();



  onRtaChange(value: number) {

  }

  onResponseChange(value: number) {

  }
}
