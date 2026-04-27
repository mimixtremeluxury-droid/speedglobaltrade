export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 lg:px-6">
      <div className="glass h-16 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass h-32 animate-pulse" />
        <div className="glass h-32 animate-pulse" />
        <div className="glass h-32 animate-pulse" />
      </div>
    </div>
  );
}
