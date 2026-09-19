"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex h-9 w-fit items-center gap-1 rounded-md border border-border-subtle bg-background-elevated p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        renderBeforeHydration
        className="absolute top-1/2 left-0 z-0 h-[calc(var(--active-tab-height))] w-[var(--active-tab-width)] -translate-y-1/2 translate-x-[var(--active-tab-left)] rounded-sm bg-gray-300 transition-[width,translate] duration-200 ease-(--ease-out) motion-reduce:transition-none"
      />
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-7 cursor-pointer items-center justify-center rounded-sm px-3 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-150 ease-out select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[active]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
