export default function ImagePlaceholder({ label }: { label: string }) {
  return (
    <span className="flex h-full w-full items-center justify-center">
      <span
        className="font-mono text-[11px] uppercase tracking-[0.16em]"
        style={{ color: "var(--subtle)" }}
      >
        {label}
      </span>
    </span>
  );
}
