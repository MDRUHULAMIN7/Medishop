'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { formatBDT } from '@/lib/utils';

export interface FlyToCartProductData {
  image: string;
  name: string;
  price: number;
  unit?: string;
}

interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  targetX: number;
  targetY: number;
  curveX: number;
  curveY: number;
  product: FlyToCartProductData;
}

interface FlyToCartContextType {
  flyToCart: (cardElement: HTMLElement | null, product: FlyToCartProductData) => void;
  isBouncing: boolean;
}

const FlyToCartContext = createContext<FlyToCartContextType>({
  flyToCart: () => {},
  isBouncing: false,
});

export const useFlyToCart = () => useContext(FlyToCartContext);

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const bounceDelayMs = 1520;
  const bounceDurationMs = 420;

  const flyToCart = useCallback((cardElement: HTMLElement | null, product: FlyToCartProductData) => {
    if (!cardElement || typeof window === 'undefined') return;

    const startRect = cardElement.getBoundingClientRect();
    const targetElement =
      document.getElementById('floating-cart-btn') ||
      document.getElementById('nav-cart-btn');

    if (!targetElement) return;

    const targetRect = targetElement.getBoundingClientRect();

    const startX = startRect.left;
    const startY = startRect.top;
    const startWidth = startRect.width;
    const startHeight = startRect.height;

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const startCenterX = startX + startWidth / 2;
    const startCenterY = startY + startHeight / 2;

    const targetX = targetCenterX - startCenterX;
    const targetY = targetCenterY - startCenterY;
    const distance = Math.hypot(targetX, targetY);
    const directionX = targetX >= 0 ? 1 : -1;

    // Add a gentle arc so the clone glides instead of moving in a straight line.
    const curveX = directionX * Math.min(140, Math.max(36, distance * 0.08));
    const curveY = -Math.min(140, Math.max(56, distance * 0.12));

    const newItemId = `${Date.now()}-${Math.random()}`;

    setFlyingItems((prev) => [
      ...prev,
      {
        id: newItemId,
        startX,
        startY,
        startWidth,
        startHeight,
        targetX,
        targetY,
        curveX,
        curveY,
        product,
      },
    ]);

    // Keep the flight slightly longer so the movement feels like a smooth glide.
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== newItemId));
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), bounceDurationMs);
    }, bounceDelayMs);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ flyToCart, isBouncing }}>
      {children}

      {/* Dynamic Flying Product Card Clones */}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        {flyingItems.map((item) => (
          <div
            key={item.id}
            className="fixed top-0 left-0 overflow-visible"
            style={{
              left: `${item.startX}px`,
              top: `${item.startY}px`,
              width: `${item.startWidth}px`,
              height: `${item.startHeight}px`,
              willChange: 'transform',
            }}
          >
            <div
              className="animate-fly-to-cart h-full w-full rounded-2xl bg-white border border-border shadow-2xl overflow-hidden p-2.5 flex flex-col justify-between"
              style={{
                ['--target-x' as string]: `${item.targetX}px`,
                ['--target-y' as string]: `${item.targetY}px`,
                ['--curve-x' as string]: `${item.curveX}px`,
                ['--curve-y' as string]: `${item.curveY}px`,
                willChange: 'transform, opacity',
              }}
            >
              {/* Product Image Preview */}
              <div className="relative w-full aspect-square rounded-xl bg-muted/30 overflow-hidden">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>

              {/* Product Details */}
              <div className="mt-2 flex flex-col gap-0.5">
                <span className="text-xs font-bold text-foreground truncate">
                  {item.product.name}
                </span>
                <span className="text-xs font-extrabold text-primary">
                  {formatBDT(item.product.price)}
                </span>
              </div>

              {/* Action Bar matching diagram */}
              <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-600 bg-emerald-500 text-white text-[11px] font-bold px-2 py-1 shadow-xs">
                <span>{item.product.unit || 'Piece'}</span>
                <span className="bg-emerald-700 px-1.5 py-0.5 rounded text-[10px]">Added</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FlyToCartContext.Provider>
  );
}
