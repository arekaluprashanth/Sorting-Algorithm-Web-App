# Sorting Algoritm Web App

Sorting Algoritm Web App is an interactive web app for learning and comparing sorting algorithms. It combines step-by-step visualizations, execution metrics, complexity analysis, benchmarking, and generated implementations in C++, Python, and Java.

## Features

- Explore 15 sorting algorithms, including comparison, divide-and-conquer, non-comparison, and hybrid methods.
- Enter custom arrays or generate random, even, odd, prime, sorted, reversed, and nearly sorted data.
- Play, pause, step through, loop, and inspect algorithm execution traces.
- Compare comparisons, swaps, operation counts, and measured benchmark results.
- Review best, average, and worst-case time complexity and space usage.
- Inspect pseudocode and download execution traces as JSON, CSV, Markdown, or text.
- Use the responsive interface on desktop, tablet, and mobile devices.

## Tech Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## Run Locally

**Prerequisites:** Node.js 18 or newer

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run the TypeScript check
```

## Project Structure

```text
src/
  algorithms/     Sorting implementations and simulation generators
  components/     Dashboard, visualizer, charts, benchmark, and table views
  utils/          Array generators, complexity helpers, and code generation
```
