import { jsPDF } from 'jspdf';
import { SupportedAlgorithmId, SimulationStep } from '../types';
import { ALGORITHMS } from '../algorithms';
import { SupportedLanguage } from '../utils/languageCodeGenerator';

export const downloadFile = (
  filename: string,
  content: string,
  mimeType: string = 'text/plain',
  setDownloadToast?: (msg: string | null) => void
) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (setDownloadToast) {
      setDownloadToast(`Saved "${filename}" to your Downloads folder!`);
      setTimeout(() => setDownloadToast(null), 4500);
    }
  } catch {
    if (setDownloadToast) {
      setDownloadToast(`Failed to initiate file download.`);
      setTimeout(() => setDownloadToast(null), 3000);
    }
  }
};

export const handleDownloadTraceJson = (
  selectedAlgo: any,
  appliedArray: number[],
  steps: SimulationStep[],
  setDownloadToast: (msg: string | null) => void,
  setDownloadMenuOpen: (open: boolean) => void
) => {
  const data = {
    algorithm: {
      id: selectedAlgo.id,
      name: selectedAlgo.name,
      category: selectedAlgo.category,
      bestTime: selectedAlgo.bestTime,
      avgTime: selectedAlgo.avgTime,
      worstTime: selectedAlgo.worstTime,
      space: selectedAlgo.space,
      stable: selectedAlgo.stable,
      inPlace: selectedAlgo.inPlace,
      recurrenceRelation: selectedAlgo.recurrenceRelation,
    },
    executionSummary: {
      inputSize: appliedArray.length,
      initialArray: appliedArray,
      sortedArray: steps.length > 0 ? steps[steps.length - 1].array : [...appliedArray].sort((a, b) => a - b),
      totalSimulationFrames: steps.length,
      totalComparisons: steps.length > 0 ? steps[steps.length - 1].comparisons : 0,
      totalSwaps: steps.length > 0 ? steps[steps.length - 1].swaps : 0,
      exportedAt: new Date().toISOString(),
    },
    frames: steps.map((s, idx) => ({
      frameNumber: idx + 1,
      description: s.description,
      pseudocodeLine: s.pseudocodeLine,
      comparisonsSoFar: s.comparisons,
      swapsSoFar: s.swaps,
      activeRange: s.activeRange || null,
      comparingIndices: s.comparing || null,
      swappingIndices: s.swapping || null,
      pivotIndex: s.pivotIndex !== undefined ? s.pivotIndex : null,
      sortedIndices: s.sortedIndices || [],
      arrayState: s.array,
    })),
  };
  downloadFile(`${selectedAlgo.id}_execution_trace.json`, JSON.stringify(data, null, 2), 'application/json', setDownloadToast);
  setDownloadMenuOpen(false);
};

export const handleDownloadTraceTranscript = (
  selectedAlgoId: SupportedAlgorithmId,
  selectedAlgo: any,
  appliedArray: number[],
  steps: SimulationStep[],
  setDownloadToast: (msg: string | null) => void,
  setDownloadMenuOpen: (open: boolean) => void
) => {
  const totalC = steps.length > 0 ? steps[steps.length - 1].comparisons : 0;
  const totalS = steps.length > 0 ? steps[steps.length - 1].swaps : 0;
  const finalArr = steps.length > 0 ? steps[steps.length - 1].array : [...appliedArray].sort((a, b) => a - b);

  let text = `================================================================================\n`;
  text += `  ALGORITHM EXECUTION TRACE TRANSCRIPT: ${selectedAlgo.name.toUpperCase()}\n`;
  text += `================================================================================\n\n`;
  text += `Algorithm:          ${selectedAlgo.name}\n`;
  text += `Tagline:            ${selectedAlgo.tagline}\n`;
  text += `Time Complexity:    Best: ${selectedAlgo.bestTime} | Avg: ${selectedAlgo.avgTime} | Worst: ${selectedAlgo.worstTime}\n`;
  text += `Space Complexity:   ${selectedAlgo.space}\n`;
  text += `Stability / Memory: ${selectedAlgo.stable ? 'Stable' : 'Unstable'} | ${selectedAlgo.inPlace ? 'In-Place' : 'Out-of-Place'}\n`;
  text += `Date / Timestamp:   ${new Date().toLocaleString()}\n`;
  text += `Input Array (N=${appliedArray.length}): [${appliedArray.join(', ')}]\n`;
  text += `Final Sorted Array:   [${finalArr.join(', ')}]\n`;
  text += `Total Frames:       ${steps.length}\n`;
  text += `Total Comparisons:  ${totalC}\n`;
  text += `Total Swaps/Shifts: ${totalS}\n\n`;
  text += `--------------------------------------------------------------------------------\n`;
  text += `FRAME-BY-FRAME EXECUTION LOG\n`;
  text += `--------------------------------------------------------------------------------\n`;

  steps.forEach((s, idx) => {
    let actionType = 'TRANSITION';
    if (idx === 0) actionType = 'INITIAL';
    else if (idx === steps.length - 1) actionType = 'COMPLETED';
    else if (s.swapping) actionType = selectedAlgoId === 'insertionSort' ? 'SHIFT' : 'SWAP';
    else if (s.comparing) actionType = 'COMPARE';
    else if (s.pivotIndex !== undefined) actionType = selectedAlgoId === 'insertionSort' ? 'KEY' : 'PIVOT';

    text += `\n[Frame #${String(idx + 1).padStart(3, '0')}] [${actionType.padEnd(12, ' ')}] (Line ${s.pseudocodeLine || 1})\n`;
    text += `  Array State: [${s.array.join(', ')}]\n`;
    text += `  Action:      ${s.description}\n`;
    text += `  Progress:    Comparisons: ${s.comparisons} | Swaps: ${s.swaps}\n`;
    if (s.sortedIndices && s.sortedIndices.length > 0) {
      text += `  Sorted Idxs: [${s.sortedIndices.join(', ')}]\n`;
    }
  });

  text += `\n================================================================================\n`;
  text += `  END OF EXECUTION TRACE - STATUS: FULLY SORTED\n`;
  text += `================================================================================\n`;

  downloadFile(`${selectedAlgo.id}_trace_log.txt`, text, 'text/plain', setDownloadToast);
  setDownloadMenuOpen(false);
};

export const handleDownloadCsv = (
  selectedAlgoId: SupportedAlgorithmId,
  selectedAlgo: any,
  steps: SimulationStep[],
  setDownloadToast: (msg: string | null) => void,
  setDownloadMenuOpen: (open: boolean) => void
) => {
  let csv = `FrameNumber,ActionType,PseudocodeLine,Comparisons,Swaps,ArrayState,Description\n`;
  steps.forEach((s, idx) => {
    let actionType = 'TRANSITION';
    if (idx === 0) actionType = 'INITIAL';
    else if (idx === steps.length - 1) actionType = 'COMPLETED';
    else if (s.swapping) actionType = selectedAlgoId === 'insertionSort' ? 'SHIFT' : 'SWAP';
    else if (s.comparing) actionType = 'COMPARE';

    const arrayStr = `"[${s.array.join(', ')}]"`;
    const descEscaped = `"${s.description.replace(/"/g, '""')}"`;
    csv += `${idx + 1},${actionType},${s.pseudocodeLine || 1},${s.comparisons},${s.swaps},${arrayStr},${descEscaped}\n`;
  });
  downloadFile(`${selectedAlgo.id}_frames.csv`, csv, 'text/csv', setDownloadToast);
  setDownloadMenuOpen(false);
};

export const handleDownloadMarkdownReport = (
  selectedAlgo: any,
  appliedArray: number[],
  steps: SimulationStep[],
  setDownloadToast: (msg: string | null) => void,
  setDownloadMenuOpen: (open: boolean) => void
) => {
  const totalC = steps.length > 0 ? steps[steps.length - 1].comparisons : 0;
  const totalS = steps.length > 0 ? steps[steps.length - 1].swaps : 0;
  const finalArr = steps.length > 0 ? steps[steps.length - 1].array : [...appliedArray].sort((a, b) => a - b);

  let md = `# ${selectedAlgo.name} Execution Analysis Report\n\n`;
  md += `> **Tagline**: ${selectedAlgo.tagline}\n\n`;
  md += `## Algorithm Specifications\n\n`;
  md += `- **Category**: ${selectedAlgo.category.replace('_', ' ').toUpperCase()}\n`;
  md += `- **Time Complexity**: Best \`${selectedAlgo.bestTime}\` | Avg \`${selectedAlgo.avgTime}\` | Worst \`${selectedAlgo.worstTime}\`\n`;
  md += `- **Space Complexity**: \`${selectedAlgo.space}\`\n`;
  md += `- **Stability**: ${selectedAlgo.stable ? 'Stable' : 'Unstable'}\n`;
  md += `- **In-Place**: ${selectedAlgo.inPlace ? 'Yes' : 'No'}\n`;
  md += `- **Recurrence Relation**: \`${selectedAlgo.recurrenceRelation}\`\n\n`;
  md += `## Input & Output Execution Summary\n\n`;
  md += `- **Array Size ($N$)**: ${appliedArray.length} elements\n`;
  md += `- **Initial Array**: \`[${appliedArray.join(', ')}]\`\n`;
  md += `- **Final Sorted Array**: \`[${finalArr.join(', ')}]\`\n`;
  md += `- **Total Simulation Frames**: ${steps.length}\n`;
  md += `- **Total Comparisons**: ${totalC}\n`;
  md += `- **Total Swaps / Shifts**: ${totalS}\n\n`;
  md += `## Pseudocode\n\n\`\`\`\n`;
  (selectedAlgo.pseudocode || []).forEach((line: string, idx: number) => {
    md += `${idx + 1}. ${line}\n`;
  });
  md += `\`\`\`\n\n`;
  md += `*Generated automatically by Algorithm Visualizer on ${new Date().toLocaleDateString()}*\n`;

  downloadFile(`${selectedAlgo.id}_report.md`, md, 'text/markdown', setDownloadToast);
  setDownloadMenuOpen(false);
};

export interface PdfExportOptions {
  selectedAlgo: any;
  appliedArray: number[];
  steps: SimulationStep[];
  currentStepIdx: number;
  arrayStats: any;
  selectedLang: SupportedLanguage;
  languageLabel: string;
  graphMetric: 'totalOps' | 'comparisons' | 'swaps';
  comparisonAlgoIds: SupportedAlgorithmId[];
  userArrayAlgoResults: any[];
  currentStep: SimulationStep;
  languageData: any;
  setDownloadToast: (msg: string | null) => void;
  setDownloadMenuOpen: (open: boolean) => void;
}

export const handleDownloadPdf = (options: PdfExportOptions) => {
  const {
    selectedAlgo, appliedArray, steps, currentStepIdx, arrayStats,
    selectedLang, languageLabel, graphMetric, comparisonAlgoIds,
    userArrayAlgoResults, currentStep, languageData,
    setDownloadToast, setDownloadMenuOpen
  } = options;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;
  const finalArr = steps.length > 0 ? steps[steps.length - 1].array : [...appliedArray].sort((a, b) => a - b);
  const totalC = steps.length > 0 ? steps[steps.length - 1].comparisons : 0;
  const totalS = steps.length > 0 ? steps[steps.length - 1].swaps : 0;
  let y = 0;

  const addFooter = () => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Sorting Algoritm Web App', margin, pageHeight - 20);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - 54) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  };

  const addSectionTitle = (title: string) => {
    ensureSpace(32);
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(margin, y, contentWidth, 24, 5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin + 10, y + 16);
    y += 36;
  };

  const addWrappedText = (text: string, size = 9, color: [number, number, number] = [71, 85, 105]) => {
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * (size + 4) + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(lines, margin, y);
    y += lines.length * (size + 4) + 4;
  };

  const addTable = (headers: string[], rows: string[][], columnWidths: number[]) => {
    const headerHeight = 24;
    ensureSpace(headerHeight + 12);
    let x = margin;
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, headerHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(248, 250, 252);
    headers.forEach((header, index) => {
      doc.text(header, x + 8, y + 16);
      x += columnWidths[index];
    });
    y += headerHeight;

    rows.forEach((row, rowIndex) => {
      const wrappedCells = row.map((cell, index) => doc.splitTextToSize(cell, columnWidths[index] - 16));
      const rowHeight = Math.max(...wrappedCells.map((cell) => cell.length), 1) * 11 + 10;
      ensureSpace(rowHeight);
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, rowHeight, 'F');
      }
      x = margin;
      wrappedCells.forEach((cell, index) => {
        doc.setFont('helvetica', index === 0 ? 'bold' : 'normal');
        doc.setFontSize(8);
        doc.setTextColor(index === 0 ? 15 : 71, index === 0 ? 23 : 85, index === 0 ? 42 : 105);
        doc.text(cell, x + 8, y + 15);
        x += columnWidths[index];
      });
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);
      y += rowHeight;
    });
    y += 12;
  };

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 132, 'F');
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(margin, 30, 44, 44, 10, 10, 'F');
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(3);
  doc.line(margin + 12, 61, margin + 18, 48);
  doc.line(margin + 22, 61, margin + 28, 42);
  doc.line(margin + 32, 61, margin + 38, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(248, 250, 252);
  doc.text('Execution Analysis Report', margin, 101);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(165, 180, 252);
  doc.text('Sorting Algoritm Web App', margin, 119);
  y = 164;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(15, 23, 42);
  doc.text(selectedAlgo.name, margin, y);
  y += 22;
  addWrappedText(selectedAlgo.tagline, 10, [71, 85, 105]);
  addWrappedText(`Generated ${new Date().toLocaleString()}  |  Current frame ${currentStepIdx + 1} of ${steps.length}`, 8, [100, 116, 139]);

  addSectionTitle('Algorithm Profile');
  const profileRows = [
    ['Category', selectedAlgo.category.replace(/_/g, ' ')],
    ['Time complexity', `Best: ${selectedAlgo.bestTime}   Average: ${selectedAlgo.avgTime}   Worst: ${selectedAlgo.worstTime}`],
    ['Space complexity', selectedAlgo.space],
    ['Stability', selectedAlgo.stable ? 'Stable' : 'Unstable'],
    ['Memory behavior', selectedAlgo.inPlace ? 'In-place' : 'Out-of-place'],
  ];
  addTable(['Property', 'Details'], profileRows, [112, contentWidth - 112]);

  addSectionTitle('Selected Input and Result');
  addWrappedText(`Input array (N = ${appliedArray.length}): [${appliedArray.join(', ')}]`, 9, [15, 23, 42]);
  addWrappedText(`Sorted result: [${finalArr.join(', ')}]`, 9, [15, 23, 42]);

  addSectionTitle('Input Array Analysis');
  addTable(
    ['Measure', 'Value'],
    [
      ['Elements', appliedArray.length.toLocaleString()],
      ['Ordering', arrayStats.stateLabel],
      ['Out-of-order pairs', arrayStats.inversions.toLocaleString()],
      ['Disorder', `${arrayStats.disorderPercent}%`],
      ['Input summary', arrayStats.description],
    ],
    [150, contentWidth - 150]
  );

  addSectionTitle('Report Scope and Selections');
  addTable(
    ['Selection', 'Details'],
    [
      ['Active algorithm', selectedAlgo.name],
      ['Source language', languageLabel || selectedLang],
      ['Graph metric', graphMetric === 'totalOps' ? 'Total operations' : graphMetric === 'comparisons' ? 'Comparisons' : 'Swaps / writes'],
      ['Comparison set', comparisonAlgoIds.length > 0 ? comparisonAlgoIds.map((id) => ALGORITHMS[id].info.name).join(', ') : 'No manual comparison set selected'],
      ['Report contents', 'Input, array analysis, algorithm profile, selected logic, pseudocode, source code, current step, and execution trace'],
    ],
    [125, contentWidth - 125]
  );

  if (comparisonAlgoIds.length >= 2) {
    const selectedComparisonResults = comparisonAlgoIds
      .map((id) => userArrayAlgoResults.find((result) => result.id === id))
      .filter((result) => Boolean(result))
      .sort((a, b) => a.totalOps - b.totalOps);
    addSectionTitle('Selected Comparison Insights');
    addTable(
      ['Result', 'Algorithm', 'Measured operations'],
      comparisonAlgoIds.length === 2
        ? [
            ['Best', selectedComparisonResults[0]?.name || 'Unavailable', selectedComparisonResults[0]?.totalOps.toLocaleString() || '0'],
            ['Worst', selectedComparisonResults[1]?.name || 'Unavailable', selectedComparisonResults[1]?.totalOps.toLocaleString() || '0'],
          ]
        : [
            ['Best', selectedComparisonResults[0]?.name || 'Unavailable', selectedComparisonResults[0]?.totalOps.toLocaleString() || '0'],
            ['Average', selectedComparisonResults[Math.floor(selectedComparisonResults.length / 2)]?.name || 'Unavailable', selectedComparisonResults[Math.floor(selectedComparisonResults.length / 2)]?.totalOps.toLocaleString() || '0'],
            ['Worst', selectedComparisonResults[selectedComparisonResults.length - 1]?.name || 'Unavailable', selectedComparisonResults[selectedComparisonResults.length - 1]?.totalOps.toLocaleString() || '0'],
          ],
      [100, 220, contentWidth - 320]
    );
  }

  ensureSpace(70);
  const metricCards = [
    ['Frames', steps.length.toLocaleString(), [79, 70, 229] as [number, number, number]],
    ['Comparisons', totalC.toLocaleString(), [5, 150, 105] as [number, number, number]],
    ['Swaps / shifts', totalS.toLocaleString(), [225, 29, 72] as [number, number, number]],
  ];
  const cardWidth = (contentWidth - 18) / 3;
  metricCards.forEach(([label, value, color], index) => {
    const x = margin + index * (cardWidth + 9);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, cardWidth, 52, 6, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label as string, x + 9, y + 17);
    doc.setFontSize(15);
    doc.setTextColor(...(color as [number, number, number]));
    doc.text(value as string, x + 9, y + 39);
  });
  y += 72;

  addSectionTitle('Current Execution Step');
  const currentDescription = steps[currentStepIdx]?.description || 'Ready to begin.';
  addWrappedText(currentDescription, 10, [15, 23, 42]);
  addWrappedText(`Progress at this frame: ${currentStep.comparisons.toLocaleString()} comparisons, ${currentStep.swaps.toLocaleString()} swaps / shifts.`, 9);

  addSectionTitle('Pseudocode');
  (selectedAlgo.pseudocode || []).forEach((line: string, index: number) => {
    addWrappedText(`${index + 1}.  ${line}`, 8, [51, 65, 85]);
  });

  addSectionTitle(`${languageLabel || selectedLang} Implementation and Logic`);
  addWrappedText(languageData[selectedLang]?.logic.title || 'Selected implementation overview', 11, [15, 23, 42]);
  addWrappedText(languageData[selectedLang]?.logic.summary || 'This section describes the selected implementation for the current algorithm.', 9);
  (languageData[selectedLang]?.logic.steps || []).forEach((step: any, index: number) => {
    addWrappedText(`${index + 1}. ${step.heading}`, 9, [15, 23, 42]);
    addWrappedText(step.description, 8, [71, 85, 105]);
    addWrappedText(`Code: ${step.codeSnippet}`, 8, [51, 65, 85]);
  });

  addSectionTitle(`Selected Source Code (${languageLabel || selectedLang})`);
  const sourceCode = languageData[selectedLang]?.code || 'Source code is unavailable for this selection.';
  sourceCode.split('\n').forEach((line: string, index: number) => {
    const codeLines = doc.splitTextToSize(`${String(index + 1).padStart(3, ' ')}  ${line || ' '}`, contentWidth - 14);
    ensureSpace(codeLines.length * 10 + 6);
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 8, contentWidth, codeLines.length * 10 + 6, 'F');
    }
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(codeLines, margin + 7, y);
    y += codeLines.length * 10 + 3;
  });

  addSectionTitle('Execution Trace');
  const maxPdfSteps = Math.min(steps.length, 250);
  const traceSubset = steps.slice(0, maxPdfSteps);
  traceSubset.forEach((step, index) => {
    const traceText = `${String(index + 1).padStart(3, '0')}   ${step.description}   [${step.comparisons} comparisons / ${step.swaps} swaps]`;
    const lines = doc.splitTextToSize(traceText, contentWidth - 14);
    ensureSpace(lines.length * 12 + 8);
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y - 10, contentWidth, lines.length * 12 + 8, 3, 3, 'F');
    }
    doc.setFont('courier', index === currentStepIdx ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(index === currentStepIdx ? 79 : 71, index === currentStepIdx ? 70 : 85, index === currentStepIdx ? 229 : 105);
    doc.text(lines, margin + 7, y);
    y += lines.length * 12 + 5;
  });

  if (steps.length > 250) {
    addWrappedText(`... and ${steps.length - 250} more steps. (Full trace dataset available in .json and .txt exports).`, 8, [100, 116, 139]);
  }

  addFooter();
  try {
    doc.save(`${selectedAlgo.id}_execution_report.pdf`);
    setDownloadToast(`Saved ${selectedAlgo.name} PDF report to your laptop Downloads folder!`);
    setTimeout(() => setDownloadToast(null), 4500);
  } catch (err) {
    console.error('PDF save error:', err);
    setDownloadToast('Unable to export PDF. Please try again.');
    setTimeout(() => setDownloadToast(null), 3000);
  }
  setDownloadMenuOpen(false);
};
