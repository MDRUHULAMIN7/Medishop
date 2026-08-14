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
  const [selectAll, setSelectAll] = useState(true);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
      {/* Table Header matching Screenshot */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center bg-gray-50/80 px-6 py-3.5 border-b border-gray-200 text-xs font-bold text-gray-500">
        <div className="col-span-5 flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => setSelectAll(e.target.checked)}
            className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span>{isBn ? 'সবগুলো নির্বাচন করুন' : 'Select All'}</span>
          <span className="ml-8">{isBn ? 'পণ্য' : 'Product'}</span>
        </div>
        <div className="col-span-2 text-center">{isBn ? 'মূল্য' : 'Price'}</div>
        <div className="col-span-3 text-center">{isBn ? 'পরিমাণ' : 'Quantity'}</div>
        <div className="col-span-2 text-right">{isBn ? 'সাবটোটাল' : 'Subtotal'}</div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-0">
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
                isSelected={selectAll}
                isBn={isBn}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveRequest={(item) => setItemToRemove(item)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
