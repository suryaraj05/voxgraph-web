export function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full blur-[120px]"
        style={{ background: "rgba(59, 130, 246, 0.1)" }}
      />
      <div
        className="absolute -right-24 top-0 h-[400px] w-[400px] rounded-full blur-[100px]"
        style={{ background: "rgba(0, 212, 255, 0.07)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: "rgba(99, 102, 241, 0.08)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(59,130,246,0.2) 50%, transparent)",
        }}
      />
    </div>
  );
}
