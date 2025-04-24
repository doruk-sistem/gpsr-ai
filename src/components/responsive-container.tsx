import { cn } from "@/lib/utils/cn";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function ResponsiveContainer({
  children,
  className,
  as: Component = "div",
}: ResponsiveContainerProps) {
  return (
    <Component className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Component>
  );
}
