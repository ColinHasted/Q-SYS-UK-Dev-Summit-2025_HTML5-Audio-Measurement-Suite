import { Component, effect, input } from '@angular/core';
import { Chart, registerables, LogarithmicScale } from 'chart.js';

@Component({
  selector: 'app-rta',
  imports: [],
  templateUrl: './rta.component.html',
  styleUrl: './rta.component.scss',
})
export class RtaComponent {
  // Chart instance
  private chart: any;
  rta = input.required<number[]>();
  frequencies = input.required<number[]>();
  freeze = input<boolean>(false);
  
  // Internal frozen data storage
  private frozenRtaData: number[] | null = null;

  constructor() {
    Chart.register(...registerables, LogarithmicScale);
    // Use SinkinSans for all chart text
    (Chart.defaults as any).font = (Chart.defaults as any).font || {};
    (Chart.defaults as any).font.family = 'SinkinSans, Helvetica, sans-serif';

    // Effect to handle freeze state changes
    effect(() => {
      const isFrozen = this.freeze();
      const rta = this.rta();

      if (!this.chart) return;

      if (isFrozen && !this.frozenRtaData) {
        // Capture current data when freezing
        this.frozenRtaData = rta ? [...rta] : null;
      } else if (!isFrozen) {
        // Clear frozen data when unfreezing
        this.frozenRtaData = null;
      }
    });

    // Effect to redraw the chart whenever data changes
    effect(() => {
      const rta = this.rta();

      if (!this.chart) return;
      this.chart.data.labels = this.frequencies() ?? [];
      this.chart.data.datasets[0].data = rta;

      // Update frozen data
      if (this.frozenRtaData) {
        this.chart.data.datasets[1].data = this.frozenRtaData;
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

  // Initialize the chart
  private initChart(): void {
    const ctx = document.getElementById(
      'rtaResponseGraph'
    ) as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.frequencies() ?? [], // X-axis is the frequency values
        datasets: [
          {
            label: 'Response (dB)',
            data: this.rta(), // Y-axis is the magnitude data from the signal
            borderColor: 'rgba(192, 75, 192, 1)', // Different color for the second line
            borderWidth: 2,
            backgroundColor: 'rgba(192, 75, 192, 0.5)',
            fill: 'start',
            pointRadius: 0, // No points, just the line
            yAxisID: 'y', // Attach to the right Y-axis
          },
          {
            label: 'Frozen Response',
            data: [],
            borderColor: 'rgba(128, 50, 128, 0.6)', // Darker, muted purple version
            borderWidth: 2,
            fill: false, // No fill for frozen trace, just a line
            pointRadius: 0,
            yAxisID: 'y',
          },
        ],
      },
      options: {
        animation: {
          duration: 100,
        }, // Disable initial animation

        maintainAspectRatio: false,
        responsive: true,
        layout: {
          padding: {
            right: 20,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Real Time Analyser',
            color: 'white', // Change title color here
            font: {
              family: 'SinkinSans, Helvetica, sans-serif',
              size: 12,
              weight: 400,
            },
            padding: {
              top: 0, // Move the title into the graph
              bottom: 5, // Add bottom padding for spacing
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
            title: {
              display: true,
              text: 'Response (dB)',
              color: 'white',
            },
            min: -60, // Set fixed min for dB scale
            max: 20, // Set fixed max for dB scale
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // Change X-axis grid line color
            },
            ticks: {
              color: 'white', // Change Y1-axis label color
              //  stepSize: 20,  // Step size for the second Y-axis
            },
          },
        },
      },
    });
    // Ensure chart measures the final CSS-sized canvas
    this.chart.resize();
  }
}
