import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "metric";
}

export function LoadingSkeleton({ className, variant = "card" }: LoadingSkeletonProps) {
  if (variant === "circle") {
    return (
      <div className={cn("w-16 h-16 rounded-full shimmer", className)} />
    );
  }
  
  if (variant === "text") {
    return (
      <div className={cn("h-4 shimmer rounded", className)} />
    );
  }
  
  if (variant === "metric") {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="h-5 w-20 shimmer rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-16 w-16 mx-auto shimmer rounded-full" />
          <div className="h-4 w-32 mx-auto shimmer rounded" />
          <div className="h-3 w-24 mx-auto shimmer rounded" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <div className="h-6 w-3/4 shimmer rounded" />
        <div className="h-4 w-1/2 shimmer rounded" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 shimmer rounded" />
        <div className="h-4 w-5/6 shimmer rounded" />
        <div className="h-4 w-4/6 shimmer rounded" />
      </CardContent>
    </Card>
  );
}