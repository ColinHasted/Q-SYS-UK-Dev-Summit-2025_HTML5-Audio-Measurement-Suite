import { Component, effect, input } from '@angular/core';
import { Chart, LogarithmicScale, registerables } from 'chart.js';
import {
  QrwcResponsalyzerComponent,
  RtaBandwidth,
} from '../../services/components/qrwc-responsalyzer-component';

@Component({
  selector: 'app-phase',
  imports: [],
  templateUrl: './phase.component.html',
})
export class PhaseComponent {
  // Chart instance
  private chart: any;
  phase = input.required<number[]>();
  frequencies = input.required<number[]>();
  freeze = input<boolean>(false);
  
  // Internal frozen data storage
  private frozenPhaseData: number[] | null = null;

  constructor() {
    Chart.register(...registerables, LogarithmicScale);
    // Use SinkinSans for all chart text
    (Chart.defaults as any).font = (Chart.defaults as any).font || {};
    (Chart.defaults as any).font.family = 'SinkinSans, Helvetica, sans-serif';

    // Effect to handle freeze state changes
    effect(() => {
      const isFrozen = this.freeze();
      const phase = this.phase();

      if (!this.chart) return;

      if (isFrozen && !this.frozenPhaseData) {
        // Capture current data when freezing
        this.frozenPhaseData = phase ? [...phase] : null;
      } else if (!isFrozen) {
        // Clear frozen data when unfreezing
        this.frozenPhaseData = null;
      }
    });

    effect(() => {
      const phase = this.phase();
      
      if (!this.chart) return;

      this.chart.data.datasets[0].data = [0, ...(phase || [])];
      this.chart.data.labels = this.frequencies() ?? [];

      // Update frozen data
      if (this.frozenPhaseData) {
        this.chart.data.datasets[1].data = [0, ...this.frozenPhaseData];
      } else {
        this.chart.data.datasets[1].data = [];
      }

      this.chart.update();
    });
  }

  ngAfterViewInit(): void {
    // Register the necessary scales
    this.initChart();
  }

  // Unwrap phase data
  private unwrapPhase(phase: number[]): number[] {
    const unwrappedPhase = [...phase];
    for (let i = 1; i < phase.length; i++) {
      while (unwrappedPhase[i] - unwrappedPhase[i - 1] > 180) {
        unwrappedPhase[i] -= 360;
      }
      while (unwrappedPhase[i] - unwrappedPhase[i - 1] < -180) {
        unwrappedPhase[i] += 360;
      }
    }
    return unwrappedPhase;
  }

  // Calculate group delay from unwrapped phase data
  private calculateGroupDelay(
    phase: number[],
    frequencies: number[]
  ): number[] {
    const groupDelay = [];
    for (let i = 1; i < phase.length; i++) {
      const deltaPhase = phase[i] - phase[i - 1];
      const deltaFreq = frequencies[i] - frequencies[i - 1];
      groupDelay.push(-deltaPhase / deltaFreq);
    }
    return groupDelay;
  }

  // Initialize the chart
  private initChart(): void {
    const ctx = document.getElementById(
      'phaseResponseGraph'
    ) as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.frequencies(), // X-axis is the frequency values
        datasets: [
          {
            label: 'Phase (degrees)',
            data: this.phase(), // Y-axis is the second line data from the second signal
            borderColor: 'rgba(192, 75, 75, 1)', // Different color for the second line
            borderWidth: 2,
            fill: false,
            pointRadius: 0, // No points, just the line
            yAxisID: 'y', // Attach to the right Y-axis
          },
          {
            label: 'Frozen Phase',
            data: [],
            borderColor: 'rgba(128, 50, 50, 0.6)', // Darker, muted version
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            yAxisID: 'y',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
          padding: {
            right: 20,
          },
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Phase ',
            color: 'white', // Change title color here
            padding: {
              bottom: 5,
            },
            align: 'end', // 'start', 'center', or 'end' to adjust positioning
          },
          legend: {
            display: false, // Set to false to hide the legend
          },
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: {
              display: true,
              text: 'Frequency (Hz)',
              color: 'white',
            },
            min: 20, // Set fixed min for dB scale
            max: 20000, // Set fixed max for dB scale
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // Change X-axis grid line color
            },
            ticks: {
              callback: (value) => {
                const predefinedValues = [
                  20, 30, 40, 50, 100, 200, 300, 400, 1000, 2000, 3000, 4000,
                  5000, 10000, 20000,
                ];

                if (predefinedValues.includes(+value)) {
                  return +value >= 1000 ? +value / 1000 + 'k' : value;
                }

                return undefined;
              },
              color: 'white',
            }, // Change Y1-axis label color},
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Phase (degrees)',
              color: 'white',
            },
            min: -180, // Different range for the second Y-axis
            max: 180, // Set fixed max for second Y-axis
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // Change X-axis grid line color
            },
            ticks: {
              color: 'white', // Change Y1-axis label color
              stepSize: 30, // Step size for the second Y-axis
            },
          },
          yCoherence: {
            type: 'linear',
            display: false, // Hide this scale from being printed
            min: 0,
            max: 100, // 0-100% represented as 0-1
          },
        },
      },
    });
    // Ensure chart measures the final CSS-sized canvas
    this.chart.resize();
  }
}
