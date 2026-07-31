# Sorting Algorithm Benchmark Web App

## Description
A professional-grade, scalable web application designed to visually demonstrate, execute, and benchmark various sorting algorithms. The application strictly separates UI from business logic, ensuring high-performance benchmark execution with accurate performance metrics, dataset validation, and future integration with Web Workers.

## Features
- **Algorithm Engine**: Modular, extensible architecture supporting Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Counting, and Radix Sort.
- **Precision Metrics**: Tracking elapsed time, comparisons, swaps, read/writes, iterations, and recursive depth.
- **Dataset Generation**: Built-in seeded generators for diverse datasets (sorted, reverse, random, duplicated, nearly-sorted).
- **Benchmark Orchestration**: UI-independent scheduling, warm-up runs, and metric aggregation.
- **Strict Validations**: Complete immutability guarantees and deep validation for algorithm prerequisites.

## Tech Stack
- **Framework**: React 19, Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: TailwindCSS, shadcn/ui (Planned)
- **Routing**: React Router
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Fetching & State**: TanStack Query
- **Forms**: React Hook Form, Zod

## Folder Structure
```text
src/
├── app/             # Application entry and global routing
├── assets/          # Static assets (images, global css)
├── components/      # Reusable generic UI components
├── benchmark/       # Core benchmark engine, metrics, and workers
├── features/        # Feature modules (algorithms, datasets)
├── hooks/           # Global React hooks
├── providers/       # Context/Global providers
├── constants/       # Global constants
├── utils/           # Helper functions
├── config/          # Configurations
├── services/        # External services / APIs
├── pages/           # Route-level page components
├── layouts/         # Layout wrappers
├── styles/          # Tailwind and CSS styles
├── types/           # Global TypeScript definitions
├── data/            # Mock/static data
└── lib/             # Third-party library integrations
```

## Installation
1. Ensure you have Node.js and `npm` installed.
2. Clone the repository and navigate into the folder:
```bash
cd "Sorting Algorithm Web App"
```
3. Install dependencies:
```bash
npm install
```

## Run Project
Start the Vite development server:
```bash
npm run dev
```

## Build Project
Compile TypeScript and bundle for production:
```bash
npm run build
```
To preview the built app locally:
```bash
npm run preview
```

## Deployment
The project is structurally prepared for Vercel deployment out-of-the-box.
1. Push your code to GitHub.
2. Import the repository in your Vercel dashboard.
3. Ensure Environment Variables (if any) are configured in Vercel.
No hardcoded localhost values exist; the configuration ensures robust deployment.

## Future Roadmap
- Implementation of comprehensive visualization charts.
- Offloading the benchmark execution entirely to background Web Workers.
- Exporting generated reports and metrics.
- Addition of analytics tracking.

## License
MIT License

## Contribution Guide
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit changes: `git commit -m "Add some feature"`.
4. Push the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.
