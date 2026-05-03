import { AppLocale, VerificationIntent } from "@/lib/types";

type EmailCopy = {
  subject: string;
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  fallback: string;
};

const EMAIL_COPY: Record<AppLocale, Record<VerificationIntent, EmailCopy>> = {
  en: {
    signup: {
      subject: "Verify your Speed Global Trade account",
      eyebrow: "Secure account verification",
      heading: "Complete your account setup",
      body: "Click the secure link below to verify your email address and finish opening your investor workspace.",
      cta: "Verify account",
      fallback: "If the button does not open, copy and paste this secure link into your browser:",
    },
    login: {
      subject: "Confirm your Speed Global Trade login",
      eyebrow: "Secure login confirmation",
      heading: "Finish signing in",
      body: "Click the secure link below to confirm this login request and continue to your investor workspace.",
      cta: "Finish sign in",
      fallback: "If the button does not open, copy and paste this secure link into your browser:",
    },
  },
  zh: {
    signup: {
      subject: "\u9a8c\u8bc1\u60a8\u7684 Speed Global Trade \u8d26\u6237",
      eyebrow: "\u5b89\u5168\u8d26\u6237\u9a8c\u8bc1",
      heading: "\u5b8c\u6210\u8d26\u6237\u8bbe\u7f6e",
      body: "\u70b9\u51fb\u4e0b\u65b9\u5b89\u5168\u94fe\u63a5\u4ee5\u9a8c\u8bc1\u60a8\u7684\u90ae\u7bb1\u5730\u5740\uff0c\u5e76\u5b8c\u6210\u6295\u8d44\u5de5\u4f5c\u533a\u7684\u5f00\u901a\u3002",
      cta: "\u9a8c\u8bc1\u8d26\u6237",
      fallback: "\u5982\u679c\u6309\u94ae\u65e0\u6cd5\u6253\u5f00\uff0c\u8bf7\u5c06\u6b64\u5b89\u5168\u94fe\u63a5\u590d\u5236\u5e76\u7c98\u8d34\u5230\u6d4f\u89c8\u5668\u4e2d\uff1a",
    },
    login: {
      subject: "\u786e\u8ba4\u60a8\u7684 Speed Global Trade \u767b\u5f55",
      eyebrow: "\u5b89\u5168\u767b\u5f55\u786e\u8ba4",
      heading: "\u5b8c\u6210\u767b\u5f55",
      body: "\u70b9\u51fb\u4e0b\u65b9\u5b89\u5168\u94fe\u63a5\u4ee5\u786e\u8ba4\u672c\u6b21\u767b\u5f55\u8bf7\u6c42\uff0c\u5e76\u7ee7\u7eed\u8fdb\u5165\u60a8\u7684\u6295\u8d44\u5de5\u4f5c\u533a\u3002",
      cta: "\u5b8c\u6210\u767b\u5f55",
      fallback: "\u5982\u679c\u6309\u94ae\u65e0\u6cd5\u6253\u5f00\uff0c\u8bf7\u5c06\u6b64\u5b89\u5168\u94fe\u63a5\u590d\u5236\u5e76\u7c98\u8d34\u5230\u6d4f\u89c8\u5668\u4e2d\uff1a",
    },
  },
  es: {
    signup: {
      subject: "Verifica tu cuenta de Speed Global Trade",
      eyebrow: "Verificaci\u00f3n segura de cuenta",
      heading: "Completa la configuraci\u00f3n de tu cuenta",
      body: "Haz clic en el enlace seguro de abajo para verificar tu correo y terminar de abrir tu espacio de inversi\u00f3n.",
      cta: "Verificar cuenta",
      fallback: "Si el bot\u00f3n no se abre, copia y pega este enlace seguro en tu navegador:",
    },
    login: {
      subject: "Confirma tu acceso a Speed Global Trade",
      eyebrow: "Confirmaci\u00f3n segura de acceso",
      heading: "Termina de iniciar sesi\u00f3n",
      body: "Haz clic en el enlace seguro de abajo para confirmar esta solicitud de acceso y continuar a tu espacio de inversi\u00f3n.",
      cta: "Finalizar acceso",
      fallback: "Si el bot\u00f3n no se abre, copia y pega este enlace seguro en tu navegador:",
    },
  },
  ar: {
    signup: {
      subject: "\u062a\u062d\u0642\u0642 \u0645\u0646 \u062d\u0633\u0627\u0628\u0643 \u0641\u064a Speed Global Trade",
      eyebrow: "\u062a\u062d\u0642\u0642 \u0622\u0645\u0646 \u0645\u0646 \u0627\u0644\u062d\u0633\u0627\u0628",
      heading: "\u0623\u0643\u0645\u0644 \u0625\u0639\u062f\u0627\u062f \u062d\u0633\u0627\u0628\u0643",
      body: "\u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0622\u0645\u0646 \u0623\u062f\u0646\u0627\u0647 \u0644\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0648\u0625\u0643\u0645\u0627\u0644 \u0641\u062a\u062d \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0633\u062a\u062b\u0645\u0631 \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0643.",
      cta: "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062d\u0633\u0627\u0628",
      fallback: "\u0625\u0630\u0627 \u0644\u0645 \u064a\u0641\u062a\u062d \u0627\u0644\u0632\u0631\u060c \u0627\u0646\u0633\u062e \u0647\u0630\u0627 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0622\u0645\u0646 \u0648\u0627\u0644\u0635\u0642\u0647 \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643:",
    },
    login: {
      subject: "\u0623\u0643\u062f \u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644\u0643 \u0625\u0644\u0649 Speed Global Trade",
      eyebrow: "\u062a\u0623\u0643\u064a\u062f \u0622\u0645\u0646 \u0644\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
      heading: "\u0623\u0643\u0645\u0644 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
      body: "\u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0622\u0645\u0646 \u0623\u062f\u0646\u0627\u0647 \u0644\u062a\u0623\u0643\u064a\u062f \u0637\u0644\u0628 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0647\u0630\u0627 \u0648\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0625\u0644\u0649 \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0633\u062a\u062b\u0645\u0631 \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0643.",
      cta: "\u0625\u0643\u0645\u0627\u0644 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
      fallback: "\u0625\u0630\u0627 \u0644\u0645 \u064a\u0641\u062a\u062d \u0627\u0644\u0632\u0631\u060c \u0627\u0646\u0633\u062e \u0647\u0630\u0627 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0622\u0645\u0646 \u0648\u0627\u0644\u0635\u0642\u0647 \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643:",
    },
  },
  hi: {
    signup: {
      subject: "\u0905\u092a\u0928\u0947 Speed Global Trade \u0916\u093e\u0924\u0947 \u0915\u094b \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0915\u0930\u0947\u0902",
      eyebrow: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0916\u093e\u0924\u093e \u0938\u0924\u094d\u092f\u093e\u092a\u0928",
      heading: "\u0905\u092a\u0928\u093e \u0916\u093e\u0924\u093e \u0938\u0947\u091f\u0905\u092a \u092a\u0942\u0930\u093e \u0915\u0930\u0947\u0902",
      body: "\u0905\u092a\u0928\u0947 \u0908\u092e\u0947\u0932 \u0915\u0940 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0928\u0947 \u0914\u0930 \u0928\u093f\u0935\u0947\u0936\u0915 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u0916\u094b\u0932\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0928\u0940\u091a\u0947 \u0926\u093f\u090f \u0917\u090f \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u093f\u0902\u0915 \u092a\u0930 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902\u0964",
      cta: "\u0916\u093e\u0924\u093e \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0915\u0930\u0947\u0902",
      fallback: "\u0905\u0917\u0930 \u092c\u091f\u0928 \u0928\u0939\u0940\u0902 \u0916\u0941\u0932\u0924\u093e \u0939\u0948, \u0924\u094b \u0907\u0938 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u093f\u0902\u0915 \u0915\u094b \u0905\u092a\u0928\u0947 \u092c\u094d\u0930\u093e\u0909\u091c\u093c\u0930 \u092e\u0947\u0902 \u0915\u0949\u092a\u0940 \u0914\u0930 \u092a\u0947\u0938\u094d\u091f \u0915\u0930\u0947\u0902:",
    },
    login: {
      subject: "\u0905\u092a\u0928\u0947 Speed Global Trade \u0932\u0949\u0917\u093f\u0928 \u0915\u0940 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0947\u0902",
      eyebrow: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u0949\u0917\u093f\u0928 \u092a\u0941\u0937\u094d\u091f\u093f",
      heading: "\u0938\u093e\u0907\u0928 \u0907\u0928 \u092a\u0942\u0930\u093e \u0915\u0930\u0947\u0902",
      body: "\u0907\u0938 \u0932\u0949\u0917\u093f\u0928 \u0905\u0928\u0941\u0930\u094b\u0927 \u0915\u0940 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0928\u0947 \u0914\u0930 \u0905\u092a\u0928\u0947 \u0928\u093f\u0935\u0947\u0936\u0915 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u092e\u0947\u0902 \u091c\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0928\u0940\u091a\u0947 \u0926\u093f\u090f \u0917\u090f \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u093f\u0902\u0915 \u092a\u0930 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902\u0964",
      cta: "\u0938\u093e\u0907\u0928 \u0907\u0928 \u092a\u0942\u0930\u093e \u0915\u0930\u0947\u0902",
      fallback: "\u0905\u0917\u0930 \u092c\u091f\u0928 \u0928\u0939\u0940\u0902 \u0916\u0941\u0932\u0924\u093e \u0939\u0948, \u0924\u094b \u0907\u0938 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u093f\u0902\u0915 \u0915\u094b \u0905\u092a\u0928\u0947 \u092c\u094d\u0930\u093e\u0909\u091c\u093c\u0930 \u092e\u0947\u0902 \u0915\u0949\u092a\u0940 \u0914\u0930 \u092a\u0947\u0938\u094d\u091f \u0915\u0930\u0947\u0902:",
    },
  },
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getVerificationEmailCopy(locale: AppLocale, intent: VerificationIntent) {
  return EMAIL_COPY[locale][intent];
}

export function renderAuthVerificationEmail({
  locale,
  intent,
  verifyUrl,
  recipientName,
}: {
  locale: AppLocale;
  intent: VerificationIntent;
  verifyUrl: string;
  recipientName: string;
}) {
  const copy = getVerificationEmailCopy(locale, intent);
  const safeUrl = escapeHtml(verifyUrl);
  const isRtl = locale === "ar";
  const greeting = isRtl ? `\u0645\u0631\u062d\u0628\u0627\u064b ${escapeHtml(recipientName)}` : `${escapeHtml(recipientName)},`;
  const textAlign = isRtl ? "right" : "left";
  const direction = isRtl ? "rtl" : "ltr";

  return `
    <html dir="${direction}">
      <body style="margin:0;background-color:#050B14;color:#C9D1D9;font-family:Inter,Arial,sans-serif;direction:${direction};text-align:${textAlign};">
        <div style="margin:0 auto;max-width:640px;padding:40px 20px;">
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:28px;background:linear-gradient(180deg,#0A111F 0%,#09111E 100%);padding:32px;">
            <p style="color:#F5A623;font-size:12px;letter-spacing:0.24em;margin:0;text-transform:uppercase;">${escapeHtml(copy.eyebrow)}</p>
            <h1 style="color:#FFFFFF;font-family:'Space Grotesk',Inter,Arial,sans-serif;font-size:32px;line-height:1.1;margin:18px 0 0;">${escapeHtml(copy.heading)}</h1>
            <p style="font-size:16px;line-height:1.8;margin:18px 0 0;">${greeting}</p>
            <p style="font-size:16px;line-height:1.8;margin:12px 0 0;">${escapeHtml(copy.body)}</p>
            <div style="margin-top:28px;">
              <a href="${safeUrl}" style="display:inline-block;background:linear-gradient(135deg,#F5A623 0%,#FFD36F 100%);border-radius:999px;color:#050B14;font-size:14px;font-weight:700;padding:14px 24px;text-decoration:none;">
                ${escapeHtml(copy.cta)}
              </a>
            </div>
            <p style="font-size:13px;line-height:1.8;margin:28px 0 0;opacity:0.82;">${escapeHtml(copy.fallback)}</p>
            <p style="font-size:13px;line-height:1.8;margin:8px 0 0;word-break:break-all;">${safeUrl}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
