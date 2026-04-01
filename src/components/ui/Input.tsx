"use client";

import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative group">
        {/* Intense Blue Glow effect on focus */}
        <div className="absolute -inset-1 bg-blue-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
        <input
          className={cn(
            "relative flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm tracking-tight",
            error && "border-red-500 focus:ring-red-500/10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
