export default function DashboardLoading() {
  return (
    <div className="surface min-h-[18rem] animate-pulse p-8">
      <div className="h-4 w-32 rounded-full bg-white/10" />
      <div className="mt-4 h-10 w-72 rounded-full bg-white/10" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 rounded-3xl bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
