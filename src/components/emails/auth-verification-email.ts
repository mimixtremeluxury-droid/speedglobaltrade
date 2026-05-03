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
      subject: "验证您的 Speed Global Trade 账户",
      eyebrow: "安全账户验证",
      heading: "完成账户设置",
      body: "点击下方安全链接以验证您的邮箱地址，并完成投资工作区的开通。",
      cta: "验证账户",
      fallback: "如果按钮无法打开，请将此安全链接复制并粘贴到浏览器中：",
    },
    login: {
      subject: "确认您的 Speed Global Trade 登录",
      eyebrow: "安全登录确认",
      heading: "完成登录",
      body: "点击下方安全链接以确认本次登录请求，并继续进入您的投资工作区。",
      cta: "完成登录",
      fallback: "如果按钮无法打开，请将此安全链接复制并粘贴到浏览器中：",
    },
  },
  es: {
    signup: {
      subject: "Verifica tu cuenta de Speed Global Trade",
      eyebrow: "Verificación segura de cuenta",
      heading: "Completa la configuración de tu cuenta",
      body: "Haz clic en el enlace seguro de abajo para verificar tu correo y terminar de abrir tu espacio de inversión.",
      cta: "Verificar cuenta",
      fallback: "Si el botón no se abre, copia y pega este enlace seguro en tu navegador:",
    },
    login: {
      subject: "Confirma tu acceso a Speed Global Trade",
      eyebrow: "Confirmación segura de acceso",
      heading: "Termina de iniciar sesión",
      body: "Haz clic en el enlace seguro de abajo para confirmar esta solicitud de acceso y continuar a tu espacio de inversión.",
      cta: "Finalizar acceso",
      fallback: "Si el botón no se abre, copia y pega este enlace seguro en tu navegador:",
    },
  },
  ar: {
    signup: {
      subject: "تحقق من حسابك في Speed Global Trade",
      eyebrow: "تحقق آمن من الحساب",
      heading: "أكمل إعداد حسابك",
      body: "اضغط على الرابط الآمن أدناه للتحقق من بريدك الإلكتروني وإكمال فتح مساحة المستثمر الخاصة بك.",
      cta: "تحقق من الحساب",
      fallback: "إذا لم يفتح الزر، انسخ هذا الرابط الآمن والصقه في متصفحك:",
    },
    login: {
      subject: "أكد تسجيل دخولك إلى Speed Global Trade",
      eyebrow: "تأكيد آمن لتسجيل الدخول",
      heading: "أكمل تسجيل الدخول",
      body: "اضغط على الرابط الآمن أدناه لتأكيد طلب تسجيل الدخول هذا والمتابعة إلى مساحة المستثمر الخاصة بك.",
      cta: "إكمال تسجيل الدخول",
      fallback: "إذا لم يفتح الزر، انسخ هذا الرابط الآمن والصقه في متصفحك:",
    },
  },
  hi: {
    signup: {
      subject: "अपने Speed Global Trade खाते को सत्यापित करें",
      eyebrow: "सुरक्षित खाता सत्यापन",
      heading: "अपना खाता सेटअप पूरा करें",
      body: "अपने ईमेल की पुष्टि करने और निवेशक कार्यक्षेत्र खोलने के लिए नीचे दिए गए सुरक्षित लिंक पर क्लिक करें।",
      cta: "खाता सत्यापित करें",
      fallback: "अगर बटन नहीं खुलता है, तो इस सुरक्षित लिंक को अपने ब्राउज़र में कॉपी और पेस्ट करें:",
    },
    login: {
      subject: "अपने Speed Global Trade लॉगिन की पुष्टि करें",
      eyebrow: "सुरक्षित लॉगिन पुष्टि",
      heading: "साइन इन पूरा करें",
      body: "इस लॉगिन अनुरोध की पुष्टि करने और अपने निवेशक कार्यक्षेत्र में जाने के लिए नीचे दिए गए सुरक्षित लिंक पर क्लिक करें।",
      cta: "साइन इन पूरा करें",
      fallback: "अगर बटन नहीं खुलता है, तो इस सुरक्षित लिंक को अपने ब्राउज़र में कॉपी और पेस्ट करें:",
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
  const greeting = isRtl ? `مرحباً ${escapeHtml(recipientName)}` : `${escapeHtml(recipientName)},`;
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
