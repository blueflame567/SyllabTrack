// Analytics wrapper - works with both Vercel Analytics and debugging
import { track as vercelTrack } from '@vercel/analytics';

// Enhanced track function with debug logging
export const track = (eventName: string, properties?: Record<string, any>) => {
  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  }

  // Send to Vercel Analytics
  try {
    vercelTrack(eventName, properties);
  } catch (error) {
    console.error('[Analytics Error]', error);
  }
};

// Legacy exports for compatibility
export const event = track;
export const pageview = (url: string) => track('pageview', { url });
