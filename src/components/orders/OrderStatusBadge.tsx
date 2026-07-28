'use client';

import React from 'react';
import { OrderStatus } from '@/types/order';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, Package, Truck, Navigation, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  isBn?: boolean;
  className?: string;
}

export function OrderStatusBadge({
  status,
  isBn = true,
  className,
}: OrderStatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'placed':
        return {
          labelEn: 'Order Placed',
          labelBn: 'অর্ডার জমা নেওয়া হয়েছে',
          icon: <Clock className="h-3 w-3" />,
          classes: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'confirmed':
        return {
          labelEn: 'Confirmed',
          labelBn: 'নিশ্চিত করা হয়েছে',
          icon: <CheckCircle2 className="h-3 w-3" />,
          classes: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'packed':
        return {
          labelEn: 'Packed',
          labelBn: 'প্যাকেজিং সম্পন্ন',
          icon: <Package className="h-3 w-3" />,
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'shipped':
        return {
          labelEn: 'Shipped',
          labelBn: 'কুরিয়ারে হস্তান্তরিত',
          icon: <Truck className="h-3 w-3" />,
          classes: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'out_for_delivery':
        return {
          labelEn: 'Out for Delivery',
          labelBn: 'ডেলিভারির পথে',
          icon: <Navigation className="h-3 w-3 animate-pulse" />,
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'delivered':
        return {
          labelEn: 'Delivered',
          labelBn: 'ডেলিভারি সম্পন্ন',
          icon: <CheckCircle2 className="h-3 w-3" />,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'cancelled':
        return {
          labelEn: 'Cancelled',
          labelBn: 'বাতিল করা হয়েছে',
          icon: <XCircle className="h-3 w-3" />,
          classes: 'bg-red-50 text-red-700 border-red-200',
        };
      default:
        return {
          labelEn: status,
          labelBn: status,
          icon: <Clock className="h-3 w-3" />,
          classes: 'bg-muted text-muted-foreground border-border',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border shadow-2xs',
        config.classes,
        className
      )}
    >
      {config.icon}
      <span>{isBn ? config.labelBn : config.labelEn}</span>
    </span>
  );
}
