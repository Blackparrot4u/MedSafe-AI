import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "warning" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-teal-600 text-white hover:bg-teal-700": variant === "default",
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200": variant === "secondary",
          "border-transparent bg-red-500 text-white hover:bg-red-600": variant === "destructive",
          "border-transparent bg-amber-500 text-white hover:bg-amber-600": variant === "warning",
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-600": variant === "success",
          "text-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
