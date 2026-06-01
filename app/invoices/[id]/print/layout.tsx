import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice — Jagdish Sharan & Sons',
};

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'white',
        overflow: 'auto',
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  );
}
