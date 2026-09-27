import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}
