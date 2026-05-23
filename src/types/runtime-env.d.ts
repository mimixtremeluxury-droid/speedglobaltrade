export {};

declare global {
  interface CloudflareEnv {
    APP_BASE_URL?: string;
    NEXT_PUBLIC_APP_BASE_URL?: string;
    NEXT_PUBLIC_STRIPE_CANCEL_URL?: string;
    NEXT_PUBLIC_STRIPE_SUCCESS_URL?: string;
    NEXT_PUBLIC_TAWK_PROPERTY_ID?: string;
    NEXT_PUBLIC_TAWK_WIDGET_ID?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    SGT_PASSWORD_PEPPER?: string;
    SGT_SESSION_SECRET?: string;
  }

  namespace NodeJS {
    interface ProcessEnv {
      APP_BASE_URL?: string;
      CLOUDFLARE_ACCOUNT_ID?: string;
      CLOUDFLARE_API_TOKEN?: string;
      NEXT_PUBLIC_APP_BASE_URL?: string;
      NEXT_PUBLIC_STRIPE_CANCEL_URL?: string;
      NEXT_PUBLIC_STRIPE_SUCCESS_URL?: string;
      NEXT_PUBLIC_TAWK_PROPERTY_ID?: string;
      NEXT_PUBLIC_TAWK_WIDGET_ID?: string;
      RESEND_API_KEY?: string;
      RESEND_FROM_EMAIL?: string;
      SGT_PASSWORD_PEPPER?: string;
      SGT_SESSION_SECRET?: string;
    }
  }
}
