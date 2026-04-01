import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "secondary"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", isLoading, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 tracking-tight relative overflow-hidden group ripple-btn"
    
    const variants = {
      default: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:scale-[1.02] active:scale-95",
      outline: "border border-blue-200 bg-white shadow-sm hover:bg-blue-50 text-blue-600 hover:border-blue-300",
      ghost: "hover:bg-blue-50 text-slate-600 hover:text-blue-600",
      secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    }

    return (
      <Comp
        className={cn(baseStyles, variants[variant], className, "h-12 px-8 py-2")}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {/* Soft glow background on default button hover */}
        {variant === "default" && !isLoading && (
            <span className="absolute inset-0 z-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        )}
        
        <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading && (
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
