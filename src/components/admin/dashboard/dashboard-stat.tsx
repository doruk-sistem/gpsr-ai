"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";

interface DashboardStatProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
  isLoading?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}

export function DashboardStat({
  title,
  value,
  description,
  icon,
  trend,
  isLoading = false,
  highlight = false,
  onClick
}: DashboardStatProps) {
  return (
    <Card 
      className={`overflow-hidden transition-all ${highlight ? 'ring-2 ring-primary' : ''} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            
            {isLoading ? (
              <Skeleton className="h-9 w-24 mt-1" />
            ) : (
              <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-3">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <div className="flex items-center">
                <div className={`flex items-center gap-1 text-xs ${
                  trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trend.direction === 'up' ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(trend.value).toLocaleString()}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-1.5">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}