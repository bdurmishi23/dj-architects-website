export default function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="py-8 text-sm leading-[1.7]"
      style={{ color: "var(--subtle)" }}
    >
      {children}
    </p>
  );
}
