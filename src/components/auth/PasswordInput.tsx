'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, error, label, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-foreground">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'w-full rounded-2xl border border-border bg-muted/20 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3.5 rounded-full p-1 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && <span className="text-[11px] font-medium text-danger">{error}</span>}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
