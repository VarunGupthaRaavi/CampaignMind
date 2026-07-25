import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, label, children, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-sm font-medium text-white group">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded-md border border-white/20 bg-background/50 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-checked:bg-purple-600 peer-checked:border-purple-500 flex items-center justify-center shadow-sm group-hover:border-purple-400",
              className
            )}
          >
            {checked && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
          </div>
        </div>
        {label || children}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
