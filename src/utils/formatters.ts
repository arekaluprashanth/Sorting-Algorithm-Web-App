/**
 * Format duration in milliseconds to human-readable string with units.
 *
 * @param ms - Execution time in milliseconds.
 * @returns Formatted duration string (ns, µs, ms, or s).
 */
export function formatTime(ms: number): string {
  if (ms < 0.001) return `${(ms * 1000000).toFixed(1)} ns`;
  if (ms < 1) return `${(ms * 1000).toFixed(1)} µs`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Format bytes into human-readable memory strings (B, KB, MB, GB).
 *
 * @param bytes - Memory footprint in bytes.
 * @returns Formatted memory string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format numbers with comma separators or optional compact notation (K, M).
 *
 * @param num - Number to format.
 * @param compact - Whether to use K/M abbreviations.
 * @returns Formatted number string.
 */
export function formatNumber(num: number, compact = false): string {
  if (compact) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format ratio or decimal as percentage string.
 *
 * @param value - Numerator or current value.
 * @param total - Denominator or total value.
 * @param decimals - Decimal places (default 1).
 * @returns Formatted percentage string.
 */
export function formatPercentage(value: number, total: number, decimals = 1): string {
  if (total === 0) return '0%';
  const pct = (value / total) * 100;
  return `${pct.toFixed(decimals)}%`;
}
