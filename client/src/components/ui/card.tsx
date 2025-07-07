import * as React from "react"
import { cn } from "@/lib/utils" // Utility function to conditionally join classNames

// Base Card container component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Default card styling using Tailwind CSS classes
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className // Additional classes passed via props
      )}
      {...props} // Spread any additional props like onClick, id, etc.
    />
  )
)
Card.displayName = "Card"

// Header section of the Card (usually contains title and description)
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6", // Vertical stacking with spacing and padding
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

// Title element inside the CardHeader
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight", // Prominent headline style
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

// Description element under the title in CardHeader
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground", // Subtle styling for secondary text
        className
      )}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

// Content section of the card (main body)
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)} // Padding with no top padding to align with header
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

// Footer section of the card (typically used for actions or links)
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0", // Flex layout with padding and no top padding
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// Exporting all card components for use in UI
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
}
