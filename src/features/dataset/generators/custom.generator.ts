import { parseCustomInputString } from '../validators/dataset.validator';

export function parseCustomDataset(customInputString?: string): number[] {
  if (!customInputString) return [];
  return parseCustomInputString(customInputString);
}
