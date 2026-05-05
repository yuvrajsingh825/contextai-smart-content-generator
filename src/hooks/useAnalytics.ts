// GA4 Analytics hook
// Set VITE_GA4_ID in your Vercel environment variables to enable tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA4_ID = 'G-CV86CPFYH7';

export function trackPageView(path: string, title?: string) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag('config', GA4_ID, {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag('event', eventName, params);
}

// Pre-built events for ContextAI
export const analytics = {
  contentGenerated: (type: string) =>
    trackEvent('generate_content', { content_type: type }),

  shareClicked: (platform: string) =>
    trackEvent('share_clicked', { platform }),

  copyOutput: () =>
    trackEvent('copy_output'),

  referralLinkCopied: () =>
    trackEvent('referral_link_copied'),

  downloadPDF: () =>
    trackEvent('download_pdf'),

  signIn: () =>
    trackEvent('sign_in'),
};
