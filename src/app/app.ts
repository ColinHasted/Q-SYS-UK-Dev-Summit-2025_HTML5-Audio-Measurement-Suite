import { Component, inject, signal } from '@angular/core';
import { QrwcAngularService } from './services/qrwc-angular-service';
import { QrwcResponsalyzerComponent } from './services/components/qrwc-responsalyzer-component';
import { RtaBandwidth } from './services/components/qrwc-responsalyzer-component';
import { ImpulseResponseComponent } from './responsalyzer/impulse-response/impulse-response.component';
import { PhaseComponent } from './responsalyzer/phase/phase.component';
import { MagnitudeComponent } from './responsalyzer/magnitude/magnitude.component';
import { RtaComponent } from './responsalyzer/rta/rta.component';
import { SplComponent } from './responsalyzer/spl/spl.component';
import { PinkNoiseComponent } from './responsalyzer/pink-noise/pink-noise.component';
import { DelayComponent } from './responsalyzer/delay/delay.component';
import { AveragingComponent } from './responsalyzer/averaging/averaging.component';
import { ViewToggleComponent } from './shared/view-toggle/view-toggle.component';
import { GainComponent } from './responsalyzer/gain/gain.component';

@Component({
  selector: 'app-root',
  imports: [
    ImpulseResponseComponent,
    PhaseComponent,
    MagnitudeComponent,
    RtaComponent,
    SplComponent,
    PinkNoiseComponent,
    DelayComponent,
    AveragingComponent,
    GainComponent,
    ViewToggleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
    // Change this to your Core's IP address if different
  // Or use the `host` query parameter in the URL to override it
  readonly coreIpAddress = '192.168.1.220';

  readonly qrwcService = inject(QrwcAngularService);
  public readonly responsalyzerComponent = new QrwcResponsalyzerComponent(
    'Responsalyzer',
    RtaBandwidth.Octave24
  );


  
  async ngOnInit(): Promise<void> {
    try {
      const entries = this.getQueryParameters();
      const pollVal = entries['poll'];
      const coreIP = String(entries['host'] ?? this.coreIpAddress);

      const pollingInterval =
        typeof pollVal === 'number'
          ? pollVal
          : parseInt(String(pollVal ?? ''), 10) || 200;

      await this.qrwcService.connect(coreIP, pollingInterval);
      console.log('QRWC connected at app startup');
    } catch (err) {
      console.error('Failed to connect QRWC on startup:', err);
      // Optionally surface a UI error or retry strategy
    }
  }

  // Signal to toggle between magnitude and RTA view
  public readonly showRta = signal(false);

  // Freeze state for capturing and displaying frozen traces
  public readonly isFrozen = signal(false);

  // Method to toggle the view
  public toggleView(): void {
    this.showRta.set(!this.showRta());
  }

  // Method to toggle freeze state
  public toggleFreeze(): void {
    this.isFrozen.set(!this.isFrozen());
  }

    /**
   * Get query parameters from the current URL.
   * - Returns a map where keys are lower-cased.
   * - Attempts to coerce numeric and boolean-looking values to the appropriate types.
   */
  getQueryParameters(): Record<string, string | number | boolean> {
    // If window isn't available (SSR), return an empty object.
    if (typeof window === 'undefined' || !window.location) {
      return {};
    }

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const queries: Record<string, string | number | boolean> = {};

    const parseValue = (v: string): string | number | boolean => {
      if (/^-?\d+$/.test(v)) return parseInt(v, 10);
      if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
      if (/^(true|false)$/i.test(v)) return v.toLowerCase() === 'true';
      return v;
    };

    for (const [key, value] of params) {
      queries[key.toLowerCase()] = parseValue(value);
    }

    return queries;
  }
}
