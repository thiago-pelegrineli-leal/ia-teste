export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="glow flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display font-extrabold text-white"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      !P
    </div>
  )
}
