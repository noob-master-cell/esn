// frontend/src/components/events/EventsListSkeleton.tsx
import React from "react";
import { Card, CardBody } from "@heroui/react";

const EventCardSkeleton: React.FC = () => {
  return (
    <Card className="max-w-sm">
      <CardBody className="p-3">
        <div className="flex gap-3">
          {/* Left: Image Skeleton */}
          <div className="flex-shrink-0">
            <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Right: Content Skeleton */}
          <div className="flex-1 min-w-0">
            {/* Header: Icon + Title */}
            <div className="flex items-start gap-2 mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>

            {/* Date & Time Skeleton */}
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>

            {/* Location Skeleton */}
            <div className="flex items-center gap-1 mb-2">
              <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>

            {/* Bottom Row: Price + Spots */}
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 bg-gray-200 rounded-full animate-pulse w-12"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>

            {/* Registration Status Skeleton */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const EventsListSkeleton: React.FC = () => {
  return (
    <div>
      {/* Results Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>

        {/* Sort/View Options Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse ml-1"></div>
          </div>
        </div>
      </div>

      {/* Events Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generate 6 skeleton cards */}
        {[...Array(6)].map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="text-center mt-12">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-40 mx-auto"></div>
      </div>
    </div>
  );
};
