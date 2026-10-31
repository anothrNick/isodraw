import type { ReactNode } from 'react';

const paths: Record<string, ReactNode> = {
  cube: <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L18.7 8 12 11.7 5.3 8 12 4.3ZM5 9.7l6 3.3v6.6l-6-3.3V9.7Zm8 9.9V13l6-3.3v6.6l-6 3.3Z" />,
  square: <path d="M4 4h16v16H4V4Zm2 2v12h12V6H6Z" />,
  rotl: <path d="M7.1 7.1A7 7 0 1 1 5 12H3a9 9 0 1 0 2.6-6.4L3 3v6h6L7.1 7.1Z" />,
  rotr: <path d="M16.9 7.1A7 7 0 1 0 19 12h2a9 9 0 1 1-2.6-6.4L21 3v6h-6l1.9-1.9Z" />,
  pointer: <path d="m5 3 14 7-6 2-2 6L5 3Z" />,
  link: <path d="M3 17h6v-2H5V9h4V7H3v10Zm12-10v2h4v6h-4v2h6V7h-6ZM8 11h8v2H8v-2Z" />,
  undo: <path d="M9 7V3L2 10l7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11Z" />,
  redo: <path d="M15 7V3l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11Z" />,
  plus: <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />,
  minus: <path d="M5 11h14v2H5z" />,
  fit: <path d="M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z" />,
  download: <path d="M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3V3ZM4 18h16v2H4v-2Z" />,
  upload: <path d="M11 16h2V6.8l3.3 3.3 1.4-1.4L12 3 6.3 8.7l1.4 1.4L11 6.8V16Zm-7 2h16v2H4v-2Z" />,
  trash: <path d="M9 3h6l1 2h4v2H4V5h4l1-2ZM6 9h12l-1 12H7L6 9Z" />,
  copy: <path d="M8 3h11v13h-2V5H8V3ZM4 7h11v14H4V7Zm2 2v10h7V9H6Z" />,
  grid: <path d="M3 3h18v18H3V3Zm2 2v4h4V5H5Zm6 0v4h4V5h-4Zm6 0v4h2V5h-2ZM5 11v4h4v-4H5Zm6 0v4h4v-4h-4Zm6 0v4h2v-4h-2ZM5 17v2h4v-2H5Zm6 0v2h4v-2h-4Zm6 0v2h2v-2h-2Z" />,
  panelL: <path d="M3 4h18v16H3V4Zm2 2v12h4V6H5Zm6 0v12h8V6h-8Z" />,
  panelR: <path d="M3 4h18v16H3V4Zm2 2v12h8V6H5Zm10 0v12h4V6h-4Z" />,
  close: <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" />,
  group: <path d="M3 3h6v2H5v4H3V3Zm12 0h6v6h-2V5h-4V3ZM3 15h2v4h4v2H3v-6Zm16 0h2v6h-6v-2h4v-4ZM8 8h8v8H8V8Z" />,
  doc: <path d="M6 2h9l5 5v15H6V2Zm2 2v16h10V8h-4V4H8Zm2 7h6v2h-6v-2Zm0 4h6v2h-6v-2Z" />,
  play: <path d="M8 5v14l11-7L8 5Z" />,
  pause: <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />,
  help: <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-1 11h2v2h-2v-2Zm1-8.5c2 0 3.5 1.3 3.5 3.1 0 1.2-.6 2-1.7 2.6-.6.4-.8.6-.8 1.3v.5h-2v-.6c0-1.3.5-2 1.6-2.7.6-.4.9-.7.9-1.1 0-.7-.6-1.2-1.5-1.2s-1.6.6-1.7 1.4l-2-.3c.2-1.8 1.7-3 3.7-3Z" />,
  layers: <path d="m12 2 10 5-10 5L2 7l10-5Zm0 2.2L6.5 7 12 9.8 17.5 7 12 4.2ZM4.2 10.9 12 14.8l7.8-3.9 2.2 1.1-10 5-10-5 2.2-1.1Zm0 5L12 19.8l7.8-3.9 2.2 1.1-10 5-10-5 2.2-1.1Z" />,
  up: <path d="M11 20V7.8l-5.3 5.3-1.4-1.4L12 4l7.7 7.7-1.4 1.4L13 7.8V20h-2Z" />,
  image: <path d="M3 4h18v16H3V4Zm2 2v9.6l4-4 4 4 2-2 4 4V6H5Zm10 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />,
};

export function Icon({ name, size = 16 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {paths[name]}
    </svg>
  );
}

export function ToolButton({
  icon,
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  icon?: keyof typeof paths;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`isd-btn${active ? ' is-active' : ''}`}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon name={icon} />}
      {children && <span className="isd-btn-label">{children}</span>}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="isd-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function NumberInput({
  value,
  onChange,
  step = 0.5,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      className="isd-input"
      value={Number.isFinite(value) ? +value.toFixed(3) : 0}
      step={step}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseFloat(e.target.value);
        if (Number.isFinite(v)) onChange(min !== undefined ? Math.max(min, v) : v);
      }}
    />
  );
}
