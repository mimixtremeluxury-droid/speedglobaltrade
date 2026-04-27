export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070b21]/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-mutedText md:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Speed Global Trade. All rights reserved.</p>
        <p>Secure digital investing experience with premium transparency.</p>
      </div>
    </footer>
  );
}
