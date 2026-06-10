// Airline Tracking Redirect Utility (Section 5.5.2 & 5.5.3)
// Extracts AWB prefix, matches against airline config, and generates tracking URLs

import { AIRLINE_TRACKING_CONFIG, AIRLINE_AWB_PREFIXES, type AirlineTrackingConfig } from '@/data/mockData';

export interface AirlineDetectionResult {
  found: boolean;
  airline?: AirlineTrackingConfig;
  trackingUrl?: string;
  awbNumber: string;
  prefix?: string;
}

/**
 * Detect airline from AWB number using the flight prefix (e.g., '6E-1234' → IndiGo)
 * or the numeric AWB prefix (e.g., '312-66761752' → IndiGo via 3-digit code)
 * 
 * Section 5.5.3 Logic:
 * 1. Read AWB prefix (characters before '-' or first 2-3 letters)
 * 2. Match against airline tracking URL config
 * 3. Inject AWB number into URL pattern {AWB} placeholder
 * 4. Open in new browser tab — user stays on system tab
 * 5. If unrecognized → show "Airline not configured" message
 */
export function detectAirlineFromAWB(awbNumber: string): AirlineDetectionResult {
  const trimmed = awbNumber.trim().toUpperCase();
  
  // Strategy 1: Try flight-number style prefix (e.g., "6E-1234", "AI-882")
  const flightPrefix = trimmed.split('-')[0];
  
  // Check if flightPrefix matches any awbPrefix in config (without the trailing '-')
  let matchedConfig = AIRLINE_TRACKING_CONFIG.find(
    c => c.awbPrefix.replace('-', '').toUpperCase() === flightPrefix
  );
  
  if (matchedConfig) {
    const trackingUrl = matchedConfig.trackingUrlPattern.replace('{AWB}', trimmed);
    return {
      found: true,
      airline: matchedConfig,
      trackingUrl,
      awbNumber: trimmed,
      prefix: flightPrefix,
    };
  }

  // Strategy 2: Try 3-digit numeric AWB prefix (e.g., "312-66761752")
  const numericPrefix = trimmed.substring(0, 3);
  const legacyMatch = AIRLINE_AWB_PREFIXES[numericPrefix];
  
  if (legacyMatch) {
    // Try to find the corresponding new config by matching airline name
    matchedConfig = AIRLINE_TRACKING_CONFIG.find(
      c => legacyMatch.airline.includes(c.awbPrefix.replace('-', ''))
    );
    
    if (matchedConfig) {
      const trackingUrl = matchedConfig.trackingUrlPattern.replace('{AWB}', trimmed);
      return {
        found: true,
        airline: matchedConfig,
        trackingUrl,
        awbNumber: trimmed,
        prefix: numericPrefix,
      };
    }

    // Fall back to legacy tracking URL
    return {
      found: true,
      airline: {
        airline: legacyMatch.airline,
        awbPrefix: numericPrefix,
        trackingUrlPattern: legacyMatch.trackingUrl,
        description: `Track on ${legacyMatch.airline} portal`,
      },
      trackingUrl: legacyMatch.trackingUrl,
      awbNumber: trimmed,
      prefix: numericPrefix,
    };
  }

  // Not found
  return {
    found: false,
    awbNumber: trimmed,
  };
}

/**
 * Open the airline tracking URL in a new tab (Section 5.5.3)
 * The page opens in a new browser tab — the user stays on the system in the original tab
 */
export function openAirlineTracking(awbNumber: string): AirlineDetectionResult {
  const result = detectAirlineFromAWB(awbNumber);
  
  if (result.found && result.trackingUrl) {
    window.open(result.trackingUrl, '_blank', 'noopener,noreferrer');
  }
  
  return result;
}
