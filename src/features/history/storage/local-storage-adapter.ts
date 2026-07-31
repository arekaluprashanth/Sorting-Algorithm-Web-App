/**
 * LocalStorageAdapter — concrete StorageAdapter backed by window.localStorage.
 *
 * Handles JSON encoding, quota detection, and graceful error recovery.
 * All keys are prefixed with `sb_` (sorting-benchmark) to avoid collisions.
 */
import type { StorageAdapter } from './storage-adapter';

const KEY_PREFIX = 'sb_';

export class LocalStorageAdapter implements StorageAdapter {
  private get storage(): Storage {
    return window.localStorage;
  }

  private prefixed(key: string): string {
    return `${KEY_PREFIX}${key}`;
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(this.prefixed(key));
    } catch {
      console.warn(`[LocalStorageAdapter] Failed to read key "${key}".`);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(this.prefixed(key), value);
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        throw new Error('STORAGE_QUOTA_EXCEEDED');
      }
      console.error(`[LocalStorageAdapter] Failed to write key "${key}".`, error);
      throw error;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(this.prefixed(key));
    } catch {
      console.warn(`[LocalStorageAdapter] Failed to remove key "${key}".`);
    }
  }

  clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key?.startsWith(KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => this.storage.removeItem(key));
    } catch {
      console.warn('[LocalStorageAdapter] Failed to clear storage.');
    }
  }

  keys(): string[] {
    const result: string[] = [];
    try {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key?.startsWith(KEY_PREFIX)) {
          result.push(key.substring(KEY_PREFIX.length));
        }
      }
    } catch {
      console.warn('[LocalStorageAdapter] Failed to enumerate keys.');
    }
    return result;
  }

  getUsedBytes(): number {
    let total = 0;
    try {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key?.startsWith(KEY_PREFIX)) {
          const value = this.storage.getItem(key);
          total += (key.length + (value?.length ?? 0)) * 2; // UTF-16 = 2 bytes per char
        }
      }
    } catch {
      // Silently return 0
    }
    return total;
  }
}
