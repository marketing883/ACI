// ============================================
// EVENT BATCHER
// Efficiently batch and send analytics events
// ============================================

import { VisitorEvent } from './types';

type EventCallback = (events: VisitorEvent[]) => Promise<void>;

export class EventBatcher {
  private queue: VisitorEvent[] = [];
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private isProcessing = false;
  private onFlush: EventCallback;
  private maxBatchSize: number;
  private flushInterval: number;
  private debug: boolean;

  constructor(
    onFlush: EventCallback,
    options: {
      maxBatchSize?: number;
      flushInterval?: number;
      debug?: boolean;
    } = {}
  ) {
    this.onFlush = onFlush;
    this.maxBatchSize = options.maxBatchSize || 20;
    this.flushInterval = options.flushInterval || 3000;
    this.debug = options.debug || false;

    // Set up page unload handler
    if (typeof window !== 'undefined') {
      // Use visibilitychange for better reliability
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushSync();
        }
      });

      // Fallback for page unload
      window.addEventListener('pagehide', () => {
        this.flushSync();
      });

      // Also handle beforeunload for older browsers
      window.addEventListener('beforeunload', () => {
        this.flushSync();
      });
    }
  }

  /**
   * Add an event to the queue
   */
  enqueue(event: VisitorEvent): void {
    this.queue.push(event);

    if (this.debug) {
      console.log('[EventBatcher] Enqueued event:', event.event_type, 'Queue size:', this.queue.length);
    }

    // Flush immediately if batch is full
    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
      return;
    }

    // Schedule flush if not already scheduled
    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => {
        this.flush();
      }, this.flushInterval);
    }
  }

  /**
   * Flush the queue asynchronously
   */
  async flush(): Promise<void> {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    if (this.queue.length === 0 || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    // Take events from queue
    const batch = this.queue.splice(0, this.maxBatchSize);

    if (this.debug) {
      console.log('[EventBatcher] Flushing batch:', batch.length, 'events');
    }

    try {
      await this.onFlush(batch);

      if (this.debug) {
        console.log('[EventBatcher] Batch sent successfully');
      }
    } catch (error) {
      if (this.debug) {
        console.error('[EventBatcher] Failed to send batch:', error);
      }

      // Re-queue failed events at the front
      this.queue.unshift(...batch);
    } finally {
      this.isProcessing = false;

      // If there are more events, schedule another flush
      if (this.queue.length > 0 && !this.flushTimeout) {
        this.flushTimeout = setTimeout(() => {
          this.flush();
        }, this.flushInterval);
      }
    }
  }

  /**
   * Flush synchronously using sendBeacon (for page unload)
   */
  flushSync(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    if (this.queue.length === 0) {
      return;
    }

    const batch = this.queue.splice(0);

    if (this.debug) {
      console.log('[EventBatcher] Sync flush:', batch.length, 'events');
    }

    // Use sendBeacon for reliable delivery during page unload
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify({ events: batch })], {
          type: 'application/json',
        });
        const success = navigator.sendBeacon('/api/analytics/events', blob);

        if (this.debug) {
          console.log('[EventBatcher] sendBeacon result:', success);
        }

        if (!success) {
          // Re-queue if sendBeacon failed
          this.queue.unshift(...batch);
        }
      } catch (error) {
        if (this.debug) {
          console.error('[EventBatcher] sendBeacon error:', error);
        }
        // Re-queue on error
        this.queue.unshift(...batch);
      }
    } else {
      // Fallback to keepalive fetch
      try {
        fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: batch }),
          keepalive: true,
        }).catch(() => {
          // Can't handle response during unload
        });
      } catch {
        // Ignore errors during unload
      }
    }
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear the queue
   */
  clear(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.queue = [];
  }

  /**
   * Destroy the batcher (cleanup)
   */
  destroy(): void {
    this.clear();
    this.isProcessing = false;
  }
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Create a throttled function
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Request animation frame throttle for scroll/resize
 */
export function rafThrottle<T extends (...args: Parameters<T>) => void>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId) {
      return;
    }
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
}
