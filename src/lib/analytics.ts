import { UserJourneyEvent, Lead } from "../types";
import { firestoreService } from "../firebase";
import { v4 as uuidv4 } from "uuid";

class Analytics {
  private sessionId: string;
  private anonymousId: string;
  private firstSeen: string;

  constructor() {
    this.sessionId = uuidv4();
    this.anonymousId = this.getOrCreateId("guida_anon_id");
    this.firstSeen = this.getOrCreateId("guida_first_seen", new Date().toISOString());
  }

  private getOrCreateId(key: string, defaultValue?: string): string {
    let id = localStorage.getItem(key);
    if (!id) {
      id = defaultValue || uuidv4();
      localStorage.setItem(key, id);
    }
    return id;
  }

  getUtms() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || null,
      medium: params.get("utm_medium") || null,
      campaign: params.get("utm_campaign") || null,
      term: params.get("utm_term") || null,
      content: params.get("utm_content") || null,
      gclid: params.get("gclid") || null,
      fbclid: params.get("fbclid") || null,
    };
  }

  getMetadata() {
    return {
      device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      browser: this.getBrowser(),
      os: this.getOS(),
      firstAccess: this.firstSeen,
      lastAccess: new Date().toISOString(),
      referrer: document.referrer || "direct",
      entryPage: window.location.pathname,
    };
  }

  private getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Other";
  }

  private getOS() {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS")) return "macOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Other";
  }

  async trackEvent(type: UserJourneyEvent["type"], action: string, metadata: any = null) {
    const event: UserJourneyEvent = {
      id: uuidv4(),
      anonymousId: this.anonymousId,
      timestamp: new Date().toISOString(),
      type,
      page: window.location.pathname,
      action,
      metadata: metadata || null,
    };

    console.log("[Analytics] Event tracked:", event);
    
    try {
      await firestoreService.add("events", event);
    } catch (e) {
      // Fail silently for tracking
    }
  }

  async trackPageView() {
    await this.trackEvent("page_view", "visit_page");
  }

  getAttributionData(): Partial<Lead> {
    const utms = this.getUtms();
    const metadata = this.getMetadata();
    
    let origin: Lead["origin"] = "direct";
    if (utms.source === "google") origin = "google";
    else if (utms.source === "ads") origin = "ads";
    else if (utms.medium === "organic") origin = "seo";
    else if (utms.source?.includes("instagram")) origin = "instagram";

    return {
      origin,
      attribution: {
        ...utms,
        referrer: metadata.referrer,
        entryPage: metadata.entryPage,
      },
      metadata: {
        device: metadata.device,
        browser: metadata.browser,
        os: metadata.os,
        firstAccess: metadata.firstAccess,
        lastAccess: metadata.lastAccess,
      }
    };
  }
}

export const analytics = new Analytics();
