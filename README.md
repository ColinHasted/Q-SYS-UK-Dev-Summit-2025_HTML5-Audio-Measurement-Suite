# ARSE - Acoustic Response and System Evaluator

A fully-featured acoustic analysis and visualization tool for professional audio system measurement and optimization. ARSE provides real-time visual feedback for acoustic measurements, utilizing the power of Q-SYS signal processing.

Built with **Q-SYS Remote Web Components (QRWC)** and Angular 20, this web-based visualization tool connects to your Q-SYS Core to display measurement data in an intuitive, responsive interface.

*Written as a demonstration for the Q-SYS UK Developer Summit 2025.*

## Features

- **Real-Time Analysis (RTA)**: Live frequency analysis visualization
- **Sound Pressure Level (SPL) Metering**: Real-time SPL display
- **Transfer Function Analysis**: Magnitude and phase response visualization
- **Impulse Response**: Time-domain analysis display
- **Pink Noise Generator**: Test signal control
- **Advanced Controls**: Gain, delay, and time-averaging adjustments
- **Professional Interface**: Clean, modern UI optimized for system commissioning and tuning

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
