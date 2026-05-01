"use client";

export function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-gradient-to-r from-gold/40 to-cyan/20 blur-[1px]"
          style={{
            width: `${6 + ((index * 9) % 18)}px`,
            height: `${6 + ((index * 9) % 18)}px`,
            left: `${(index * 11) % 100}%`,
            top: `${(index * 13) % 100}%`,
            opacity: 0.12 + (index % 4) * 0.08,
            animation: `float ${6 + (index % 5)}s ease-in-out ${(index % 6) * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
