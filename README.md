# SortBench — Sorting Algorithm Benchmark & Analytics Studio

![CI Pipeline](https://github.com/arekaluprashanth/Sorting-Algorithm-Web-App/actions/workflows/ci.yml/badge.svg)
![Version](https://img.shields.io/badge/version-1.0.0--RC-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

A production-grade, high-performance web application designed to benchmark, visualize, and analyze sorting algorithms up to **1,000,000 elements** in real time without blocking the UI thread.

---

## Key Features

- ⚡ **Web Worker Benchmark Engine**: Multi-threaded, non-blocking execution keeping the UI at a responsive 60 FPS.
- 📊 **Analytics Dashboard**: Interactive charts, operations/sec throughput, CPU timing, and memory footprint estimations.
- 🎓 **Interactive Learning Center**: Step-by-step sorting visualizer powered by `framer-motion` and live pseudocode highlights.
- 💾 **Session History Management**: Persist, compare side-by-side, filter, tag, and export benchmark sessions.
- 📄 **Export Suite**: Export session reports to CSV, JSON, PDF (with chart canvas snapshots), and printable HTML reports.
- 📱 **Progressive Web App (PWA)**: Offline execution shell and installable web app manifest.

---

## Supported Sorting Algorithms

1. **Quick Sort** (O(N log N))
2. **Merge Sort** (O(N log N) - Stable)
3. **Heap Sort** (O(N log N) - In-place)
4. **Tim Sort** (O(N log N) - Hybrid Stable)
5. **Bubble Sort** (O(N²))
6. **Selection Sort** (O(N²))
7. **Insertion Sort** (O(N²))
8. **Shell Sort** (O(N^1.5))
9. **Radix Sort** (O(N · k))
10. **Counting Sort** (O(N + K))

---

## Tech Stack

- **Core**: React 19, TypeScript 6, Vite 8, React Router v7
- **Styling**: TailwindCSS v4, Lucide Icons, Framer Motion
- **Testing**: Vitest, React Testing Library, jsdom
- **Exporting**: jsPDF, html2canvas

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
# Clone the repository
git clone https://github.com/arekaluprashanth/Sorting-Algorithm-Web-App.git
cd "Sorting Algorithm Web App"

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## Development & Quality Assurance

```bash
# Run unit & integration tests
npm test

# Generate test coverage report
npm run test:coverage

# Lint codebase
npm run lint

# Build production bundle
npm run build
```

---

## Deployment

Deployable to Vercel, Netlify, or any static web host:

```bash
npm run build
```
Output static bundle will be generated in `dist/`.

---

## Contributing & License

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
