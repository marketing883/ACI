// ============================================
// REAL-TIME ANALYTICS MODULE
// Export all analytics functionality
// ============================================

// Types
export * from './types';

// Visitor identification
export {
  generateVisitorId,
  getSessionId,
  updateLastActivity,
  getDeviceType,
  getBrowserInfo,
  getOSInfo,
  getViewportDimensions,
  getScreenDimensions,
  getUTMParams,
  getReferrer,
  getTimezone,
  getLanguage,
  getVisitorContext,
  isReturningVisitor,
  getSessionCount,
  getSessionDuration,
  shouldDisableTracking,
} from './visitor-id';

// Event batching
export { EventBatcher, debounce, throttle, rafThrottle } from './event-batcher';

// Core tracker
export {
  RealtimeTracker,
  getTracker,
  initTracker,
  destroyTracker,
} from './tracker';

// Engagement triggers
export {
  EngagementTriggerEngine,
  getTriggerEngine,
  initTriggerEngine,
  destroyTriggerEngine,
  type TriggerEvent,
  type TriggerContext,
} from './engagement-triggers';

// Predictive scoring
export {
  calculatePredictiveScore,
  scoreAllVisitors,
  type ScoringResult,
} from './predictive-scoring';
