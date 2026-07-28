import { useMemo } from 'react';
import { Order } from '@/types/order';

export function useTracking(order: Order | null) {
  const trackingData = useMemo(() => {
    if (!order || !order.timeline) {
      return {
        completedStepsCount: 0,
        totalStepsCount: 6,
        progressPercentage: 0,
        currentStep: null,
        isDelivered: false,
        isCancelled: order?.orderStatus === 'cancelled',
      };
    }

    const timeline = order.timeline;
    const completedCount = timeline.filter((t) => t.isCompleted).length;
    const totalCount = timeline.length;
    const progressPercentage = Math.round(
      (completedCount / totalCount) * 100
    );
    const currentStep = timeline.find((t) => t.isCurrent) || timeline[0];

    return {
      completedStepsCount: completedCount,
      totalStepsCount: totalCount,
      progressPercentage,
      currentStep,
      isDelivered: order.orderStatus === 'delivered',
      isCancelled: order.orderStatus === 'cancelled',
      timeline,
    };
  }, [order]);

  return trackingData;
}
