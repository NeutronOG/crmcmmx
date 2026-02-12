export function LiquidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orbes líquidos principales */}
      <div
        className="liquid-orb liquid-orb-pulse"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, oklch(0.30 0 0) 0%, transparent 70%)",
          top: "-10%",
          left: "-5%",
          animationDelay: "0s",
          animationDuration: "25s",
        }}
      />

      <div
        className="liquid-orb liquid-orb-pulse"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, oklch(0.28 0 0) 0%, transparent 70%)",
          top: "40%",
          right: "-10%",
          animationDelay: "3s",
          animationDuration: "30s",
        }}
      />

      <div
        className="liquid-orb liquid-orb-pulse"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, oklch(0.33 0 0) 0%, transparent 70%)",
          bottom: "-5%",
          left: "30%",
          animationDelay: "6s",
          animationDuration: "28s",
        }}
      />

      {/* Orbes secundarios más pequeños */}
      <div
        className="liquid-orb"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, oklch(0.28 0 0) 0%, transparent 70%)",
          top: "60%",
          left: "10%",
          animationDelay: "2s",
          animationDuration: "22s",
        }}
      />

      <div
        className="liquid-orb"
        style={{
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, oklch(0.25 0 0) 0%, transparent 70%)",
          top: "20%",
          right: "25%",
          animationDelay: "4s",
          animationDuration: "26s",
        }}
      />
    </div>
  )
}
