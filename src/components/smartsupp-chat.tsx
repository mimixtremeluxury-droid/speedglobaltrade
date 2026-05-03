import Script from "next/script";

const DEFAULT_SMARTSUPP_KEY = "bf325982577c378cebb163441ac5dea0dbe70a88";

export function SmartsuppChat() {
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY || DEFAULT_SMARTSUPP_KEY;

  if (!smartsuppKey) {
    return null;
  }

  return (
    <Script id="smartsupp-chat" strategy="afterInteractive">{`
      var _smartsupp = window._smartsupp || {};
      _smartsupp.key = '${smartsuppKey}';
      window._smartsupp = _smartsupp;
      window.smartsupp || (function(d) {
        var s, c, o = window.smartsupp = function() { o._.push(arguments); };
        o._ = [];
        s = d.getElementsByTagName('script')[0];
        c = d.createElement('script');
        c.type = 'text/javascript';
        c.charset = 'utf-8';
        c.async = true;
        c.src = 'https://www.smartsuppchat.com/loader.js?';
        if (!d.getElementById('smartsupp-loader') && s && s.parentNode) {
          c.id = 'smartsupp-loader';
          s.parentNode.insertBefore(c, s);
        }
      })(document);
    `}</Script>
  );
}
