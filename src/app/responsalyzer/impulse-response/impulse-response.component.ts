import { Component, effect, input, Signal, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {
  QrwcResponsalyzerComponent,
  RtaBandwidth,
} from '../../services/components/qrwc-responsalyzer-component';

@Component({
  selector: 'app-impulse-response',
  imports: [],
  templateUrl: './impulse-response.component.html',
})
export class ImpulseResponseComponent {
  // Chart instance
  private chart: any;

  impulse = input<number[]>();
  freeze = input<boolean>(false);
  
  // Internal frozen data storage
  private frozenImpulseData: number[] | null = null;

  constructor() {
    Chart.register();
    // Use SinkinSans for all chart text
    (Chart.defaults as any).font = (Chart.defaults as any).font || {};
    (Chart.defaults as any).font.family = 'SinkinSans, Helvetica, sans-serif';

    // Effect to handle freeze state changes
    effect(() => {
      const isFrozen = this.freeze();
      const impulse = this.impulse();

      if (!this.chart) return;

      if (isFrozen && !this.frozenImpulseData) {
        // Capture current data when freezing
        this.frozenImpulseData = impulse ? [...impulse] : null;
      } else if (!isFrozen) {
        // Clear frozen data when unfreezing
        this.frozenImpulseData = null;
      }
    });

    // Effect to redraw the chart whenever data changes
    effect(() => {
      const data = this.impulse();
      
      if (!this.chart) return;
      
      this.chart.data.datasets[0].data = data;
      
      // Update frozen data
      if (this.frozenImpulseData) {
        this.chart.data.datasets[1].data = this.frozenImpulseData;
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
  private generateLabels(): number[] {
    const sampleRate = 48000; // 48kHz
    const sampleCount = 512; // 512 samples
    const labels = [];
    for (let i = 0; i < sampleCount; i++) {
      labels.push((i / sampleRate) * 1000); // Convert to milliseconds
    }
    return labels;
  }

  // Initialize the chart
  private initChart(): void {
    const ctx = document.getElementById(
      'impulseResponseGraph'
    ) as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.generateLabels(), // X-axis is the frequency values
        datasets: [
          {
            label: 'Impulse',
            data: this.impulse(), // Y-axis is the magnitude data from the signal
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0, // No points, just the line
            yAxisID: 'y', // Attach to the right Y-axis
          },
          {
            label: 'Frozen Impulse',
            data: [],
            borderColor: 'rgba(50, 128, 128, 0.6)', // Darker, muted version
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            yAxisID: 'y',
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Allows independent width & height
        responsive: true, // Allow Chart.js to respond to container size
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        layout: {
          padding: {
            right: 20
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Impulse Response ',
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
            type: 'linear',
            title: {
              display: true,
              text: 'Time (ms)',
              color: 'white',
            },
            min: 0, // Set fixed min for dB scale
            max: 10.6, // Set fixed max for dB scale
            ticks: {
              color: 'white', // Change Y1-axis label color
              stepSize: 2.5, // Set step size for X-axis
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // Change X-axis grid line color
              drawTicks: true,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Response',
              color: 'white',
            },
            min: -1, // Set fixed min for dB scale
            max: 1, // Set fixed max for dB scale
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // Change X-axis grid line color
            },
            ticks: {
              color: 'white', // Change Y1-axis label color
              stepSize: 0.5, // Set step size for Y-axis
            },
          },
        },
      },
    });
    // Chart.js will size the canvas responsively
    this.chart.resize();
  }
}
