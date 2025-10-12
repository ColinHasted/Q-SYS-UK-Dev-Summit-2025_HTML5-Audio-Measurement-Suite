import { Component, effect, input } from '@angular/core';
import { Chart, registerables, LogarithmicScale } from 'chart.js';
import {
  QrwcResponsalyzerComponent,
  RtaBandwidth,
} from '../../services/components/qrwc-responsalyzer-component';

@Component({
  selector: 'app-magnitude',
  imports: [],
  templateUrl: './magnitude.component.html',
})
export class MagnitudeComponent {
  // Chart instance
  private chart: any;
  magnitude = input<number[]>();
  coherence = input<number[]>();
  frequencies = input<number[]>();
  freeze = input<boolean>(false);

  // Internal frozen data storage
  private frozenMagnitudeData: number[] | null = null;
  private frozenCoherenceData: number[] | null = null;

  constructor() {
    Chart.register(...registerables, LogarithmicScale);
    // Use SinkinSans for all chart text
    (Chart.defaults as any).font = (Chart.defaults as any).font || {};
    (Chart.defaults as any).font.family = 'SinkinSans, Helvetica, sans-serif';

    // Effect to handle freeze state changes
    effect(() => {
      const isFrozen = this.freeze();

      if (!this.chart) return;

      if (isFrozen && !this.frozenMagnitudeData) {
        // Capture current data when freezing
        this.frozenMagnitudeData = this.magnitude() ?? null;
      } else if (!isFrozen) {
        // Clear frozen data when unfreezing
        this.frozenMagnitudeData = null;
      }
    });

    // Effect to redraw the chart whenever data changes
    effect(() => {
      const magnitude = this.magnitude();
      const coherence = this.coherence();

     if (!this.chart) return;

      const bandwidth = RtaBandwidth.Octave; // You can make this a signal to control it dynamically

      // Update live data with smoothing
   /*   const smoothed = this.smoothData(
        magnitude || [],
        this.frequencies() || [],
        bandwidth
      );*/

      // Adjust curve tension based on bandwidth - fewer points = more smoothing
    //  const tension = this.getTensionForBandwidth(bandwidth);
    ////  this.chart.data.datasets[0].tension = tension;
    //  this.chart.data.datasets[2].tension = tension; // Frozen line too

      this.chart.data.datasets[0].data = magnitude;
      this.chart.data.datasets[1].data = coherence;
      this.chart.data.labels = this.frequencies();

      // Update frozen data
      if (this.frozenMagnitudeData ) {
        this.chart.data.datasets[2].data = this.frozenMagnitudeData;
      } else {
        this.chart.data.datasets[2].data = [];
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
      'magnitudeResponseGraph'
    ) as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.frequencies() ?? [], // X-axis is the frequency values
        datasets: [
          {
            label: 'Magnitude (dB)',
            data: this.magnitude(), // Y-axis is the magnitude data from the signal
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0, // No points, just the line
            yAxisID: 'y', // Attach to the right Y-axis
          },
          {
            label: 'Coherence',
            borderWidth: 2,
            data: this.coherence(), // Coherence data (in percentage format)
            yAxisID: 'yCoherence', // Assign to the hidden y-axis
            borderColor: 'green',
            pointRadius: 0, // No points, just the line
            fill: false,
          },
          {
            label: 'Frozen Magnitude',
            data: [],
            borderColor: 'rgba(50, 128, 128, 0.6)', // Darker, muted version
            borderWidth: 2,
            fill: false,
            tension: 0.4, // Cubic interpolation for smooth curves
            pointRadius: 0,
            yAxisID: 'y',
            animations: { x: { duration: 0 }, y: { duration: 0 } }
          },
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true, // Prevent Chart.js from auto-resizing
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
            text: 'Magnitude',
            color: 'white', // Change title color here
            font: {
              family: 'SinkinSans, Helvetica, sans-serif',
              size: 12,
              weight: 400
            },
            padding: {
              top: 0, // Move the title into the graph
              bottom: 5 // Add bottom padding for spacing
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
              text: 'Magnitude (dB)',
              color: 'white',
            },
            min: -20, // Set fixed min for dB scale
            max: 20, // Set fixed max for dB scale
            grid: {
              color: 'rgba(255, 255, 255, 0.2)', // Change X-axis grid line color
            },
            ticks: {
              color: 'white', // Change Y1-axis label color
              //  stepSize: 20,  // Step size for the second Y-axis
            },
          },

          yCoherence: {
            type: 'linear',
            display: false, // Hide this scale from being printed
            min: -300,
            max: 100, // 0-100% represented as 0-1
          },
        },
      },
    });
    // Ensure chart measures the final CSS-sized canvas
    this.chart.resize();
  }


    private smoothData(
    magnitude: number[],
    frequencies: number[],
    targetBandwidth: RtaBandwidth
  ): { magnitude: number[]; frequencies: number[] } {
    // If already at 1/24 octave and target is 1/24, no smoothing needed
    if (targetBandwidth === RtaBandwidth.Octave24) {
      return { magnitude, frequencies };
    }

    // Calculate target frequencies
    const targetFrequencies = this.calculateFrequencies(20, 20000, targetBandwidth);
    const smoothedMagnitude: number[] = [];

    // For each target frequency band, average the source data that falls within it
    for (let i = 0; i < targetFrequencies.length; i++) {
      const targetFreq = targetFrequencies[i];

      // Calculate bandwidth edges (geometric mean approach)
      const octaveFraction = this.getOctaveFraction(targetBandwidth);
      const lowerEdge = targetFreq / Math.pow(2, octaveFraction / 2);
      const upperEdge = targetFreq * Math.pow(2, octaveFraction / 2);

      // Find all source points within this band
      const pointsInBand: number[] = [];
      for (let j = 0; j < frequencies.length; j++) {
        if (frequencies[j] >= lowerEdge && frequencies[j] <= upperEdge) {
          pointsInBand.push(magnitude[j]);
        }
      }

      // Average in dB domain (linear averaging)
      if (pointsInBand.length > 0) {
        const avgMagnitude = pointsInBand.reduce((sum, val) => sum + val, 0) / pointsInBand.length;
        smoothedMagnitude.push(avgMagnitude);
      } else {
        // Interpolate if no points in band
        smoothedMagnitude.push(this.interpolate(targetFreq, frequencies, magnitude));
      }
    }

    return {
      magnitude: smoothedMagnitude,
      frequencies: targetFrequencies
    };
  }

    /**
   * Get octave fraction for bandwidth (e.g., 1/3 octave = 0.333)
   */
  private getOctaveFraction(bandwidth: RtaBandwidth): number {
    switch (bandwidth) {
      case RtaBandwidth.Octave: return 1;
      case RtaBandwidth.Octave3: return 1/3;
      case RtaBandwidth.Octave6: return 1/6;
      case RtaBandwidth.Octave12: return 1/12;
      case RtaBandwidth.Octave24: return 1/24;
      default: return 1/24;
    }
  }

  /**
   * Get appropriate curve tension based on bandwidth
   * Fewer points need more tension for smooth curves
   */
  private getTensionForBandwidth(bandwidth: RtaBandwidth): number {
    switch (bandwidth) {
      case RtaBandwidth.Octave: return 0.5;     // 11 points - highest tension
      case RtaBandwidth.Octave3: return 0.4;    // 31 points - high tension
      case RtaBandwidth.Octave6: return 0.3;    // 61 points - medium tension
      case RtaBandwidth.Octave12: return 0.2;   // 121 points - low tension
      case RtaBandwidth.Octave24: return 0;     // 241 points - no tension (straight lines)
      default: return 0;
    }
  }

    /**
   * Calculate frequencies for a given bandwidth
   */
  private calculateFrequencies(
    startFreq: number,
    endFreq: number,
    bandwidth: RtaBandwidth
  ): number[] {
    const frequencies: number[] = [];
    const numBands = bandwidth as number; // This is the actual count (11, 31, 61, 121, 241)

    // Calculate the factor based on logarithmic spacing
    const factor = Math.log10(endFreq / startFreq) / (numBands - 1);

    for (let i = 0; i < numBands; i++) {
      const freq = startFreq * Math.pow(10, i * factor);
      frequencies.push(Math.round(freq));
    }

    return frequencies;
  }

    /**
   * Logarithmic interpolation for missing data points
   */
  private interpolate(targetFreq: number, frequencies: number[], values: number[]): number {
    // Find surrounding frequencies
    let lowerIdx = 0;
    let upperIdx = frequencies.length - 1;

    for (let i = 0; i < frequencies.length - 1; i++) {
      if (frequencies[i] <= targetFreq && frequencies[i + 1] >= targetFreq) {
        lowerIdx = i;
        upperIdx = i + 1;
        break;
      }
    }

    const f1 = frequencies[lowerIdx];
    const f2 = frequencies[upperIdx];
    const v1 = values[lowerIdx];
    const v2 = values[upperIdx];

    // Logarithmic interpolation
    const logRatio = Math.log10(targetFreq / f1) / Math.log10(f2 / f1);
    return v1 + (v2 - v1) * logRatio;
  }

}
