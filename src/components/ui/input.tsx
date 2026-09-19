import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, ...props }: InputPrimitive.Props) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "h-9 w-full rounded-md border border-input bg-background-elevated px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-gray-600 focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
