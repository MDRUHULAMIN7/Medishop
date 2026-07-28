'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem as CartItemType } from '@/types/cart';
import { CartItem } from './CartItem';
import { RemoveItemDialog } from './RemoveItemDialog';

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  isBn?: boolean;
}

export function CartList({
  items,
  onUpdateQuantity,
  onRemoveFromCart,
  isBn = true,
}: CartListProps) {
  const [itemToRemove, setItemToRemove] = useState<CartItemType | null>(null);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.productId}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CartItem
              item={item}
              isBn={isBn}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveRequest={(item) => setItemToRemove(item)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <RemoveItemDialog
        isOpen={Boolean(itemToRemove)}
        item={itemToRemove}
        isBn={isBn}
        onClose={() => setItemToRemove(null)}
        onConfirmRemove={(id) => onRemoveFromCart(id)}
      />
    </div>
  );
}
