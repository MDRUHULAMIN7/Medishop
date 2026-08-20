'use client';

import { Download, Loader2 } from 'lucide-react';

interface ExportExcelButtonProps {
  onClick: () => void | Promise<void>;
  loading?: boolean;
  label?: string;
  disabled?: boolean;
}

export function ExportExcelButton({ onClick, loading = false, label = 'Export Excel', disabled = false }: ExportExcelButtonProps) {
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={disabled || loading}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> : <Download className="h-3.5 w-3.5 text-primary" />}
      {label}
    </button>
  );
}
