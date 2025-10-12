import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pink-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toggle">
      <input type="checkbox" [id]="id()" [checked]="checked()" (change)="onChange($event)" />
      <label [for]="id()">
        <span class="thumb"></span>
      </label>
    </div>
  `,
  styles: [`
    .toggle {
      align-items: center;
      display: flex;
      height: calc(var(--sz) * 2);
      justify-content: center;
      position: relative;
      width: calc(var(--sz) * 4);
    }

    input { display: none; }

    label {
      background: linear-gradient(0deg, #121720, #0d1217);
      border-radius: var(--sz);
      box-shadow: 0 0 calc(var(--sz) / 50) calc(var(--sz) / 50) #0006, 0 calc(var(--sz) * -0.05) calc(var(--sz) / 10) calc(var(--sz) / 500) #0b0b10, 0 0 calc(var(--sz) / 10) calc(var(--sz) / 50) #b9e1ff88, 0 calc(var(--sz) * -0.05) calc(var(--sz) / 5) calc(var(--sz) / 50) #15182fcc;
      height: calc(var(--sz) * 2);
      position: absolute;
      width: calc(var(--sz) * 4);
    }

    .thumb {
      align-items: center;
      animation: go-left 1s ease 0s;
      background:
        repeating-conic-gradient(#0002 0.000095%, #fff0 .0005%, #fff0 .005%, #fff0 .0005%),
        repeating-conic-gradient(#0002 0.00001%, #fff0 .00009%, #fff0 .00075%, #fff0 .000025%),
        var(--bg);
      border-radius: var(--sz);
      box-shadow: 0 calc(var(--sz) * -0.05) calc(var(--sz) * 0.05) 0 #000c inset, 0 calc(var(--sz) * 0.05) calc(var(--sz) * 0.05) 0 #fff2 inset, 0 0 calc(var(--sz) / 10) calc(var(--sz) / 50) #000c, 0 calc(var(--sz) / 3) calc(var(--sz) / 3) 0 #000d;
      cursor: pointer;
      display: flex;
      height: calc(calc(var(--sz) * 2) - calc(var(--sz) / 8));
      justify-content: flex-start;
      overflow: hidden;
      padding: calc(var(--sz) * 0.65);
      position: absolute;
      right: calc(var(--sz) * 2.05);
      top: calc(calc(var(--sz) / 10) + calc(var(--sz) / -20));
      transition: var(--tr);
      width: calc(var(--sz) * 1.875);
      z-index: 1;
    }

    input:checked + label .thumb {
      animation: go-right 1s ease 0s;
      justify-content: flex-end;
      right: calc(var(--sz) * 0.075);
      transition: var(--tr);
      width: calc(var(--sz) * 1.875);
    }

    @keyframes go-left {
      0% { right: calc(var(--sz) * 0.075); }
      40%, 60% { right: calc(var(--sz) * 0.075); }
      100% { right: calc(var(--sz) * 2.05); }
    }

    @keyframes go-right {
      0% { right: calc(var(--sz) * 2.05); }
      40%, 60% { right: calc(var(--sz) * 0.075); }
      100% { right: calc(var(--sz) * 0.075); }
    }


    label:before, label:after {
      --clr: var(--on-color, #00ff44);
      align-items: center;
      box-sizing: border-box;
      color: #fff;
      content: "ON";
      display: flex;
      float: left;
      font-size: calc(var(--sz) * 0.68);
      height: 100%;
      justify-content: center;
      line-height: calc(var(--sz) * 0.55);
      padding: 0 0 0 calc(var(--sz) * 0.2);
      text-align: center;
      text-shadow: 0 0 calc(var(--sz) * 0.1) var(--clr), 0 0 calc(var(--sz) * 0.3) #000, 0 0 calc(var(--sz) * 0.5) var(--clr), 0 calc(var(--sz) * 0.0125) calc(var(--sz) * 0.05) #233443, 0 calc(var(--sz) * -0.0125) calc(var(--sz) * 0.05) #000;
      transform-origin: 100% 50%;
      width: 50%;
      color: var(--clr);
    }

    label:after {
      --clr: var(--off-color, #243747);
      content: "OFF";
      padding: 0 calc(var(--sz) * 0.325) 0 0;
      text-shadow: 0 calc(var(--sz) * 0.0125) calc(var(--sz) * 0.05) #233443, 0 calc(var(--sz) * -0.0125) calc(var(--sz) * 0.05) #000;
      transform-origin: 0% 50%;
    }

    span.thumb:before {
      background: #121212;
      border-radius: var(--sz);
      box-shadow: 0 0 calc(var(--sz) / 50) calc(var(--sz) / 50) #0008, 0 calc(var(--sz) * -0.05) calc(var(--sz) / 10) calc(var(--sz) / 500) #000, 0 calc(var(--sz) * 0.025) calc(var(--sz) / 10) calc(var(--sz) / 500) #fff8, 0 0 calc(var(--sz) / 20) calc(var(--sz) / 25) #000;
      content: "";
      height: calc(var(--sz) / 1.75);
      position: relative;
      width: calc(var(--sz) / 1.75);
    }

    span.thumb:after {
      --clr: var(--off-color, #243747);
      --shn: var(--shn-color, #fff8);
      background: radial-gradient(circle at 50% 32%, var(--shn) 0 calc(var(--sz) / 20), var(--clr) calc(var(--sz) / 3) calc(var(--sz) / 3));
      border-radius: var(--sz);
      box-shadow: 0 0 0 calc(var(--sz) * 0.025) #000c inset, 0 0 calc(var(--sz) / 2.5) 0 var(--clr), 0 0 calc(var(--sz) / 3) calc(var(--sz) / 20) var(--clr) inset, 0 calc(var(--sz) / -20) calc(var(--sz) / 10) calc(var(--sz) / 10) #000c inset;
      content: "";
      height: calc(var(--sz) / 1.75);
      position: absolute;
      transition: var(--tr);
      width: calc(var(--sz) / 1.75);
    }

    input:checked + label span.thumb:after {
      --clr: var(--on-color, #00ff44);
      --shn: #fff;
    }

    /* default CSS variables */
    :host { --bg: linear-gradient(135deg, #17212f, #11151e); --sz: 0.8em; --tr: all 0.5s ease 0s; }
  `]
})
export class PinkToggleComponent {
  id = input<string>('pink-toggle');
  checked = input<boolean>(false);
  checkedChange = output<boolean>();

  onChange(event: Event) {
    const el = event.target as HTMLInputElement;
    this.checkedChange.emit(el.checked);
  }
}
