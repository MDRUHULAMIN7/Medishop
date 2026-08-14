'use client';

import React, { useState } from 'react';
import { User, MapPin, ShoppingBag } from 'lucide-react';
import { ProfileModule } from '@/components/dashboard/modules/ProfileModule';
import { AddressesModule } from '@/components/dashboard/modules/AddressesModule';
import { MyOrdersSection } from './MyOrdersSection';

interface UserProfileModuleProps {
  isBn?: boolean;
}

export function UserProfileModule({ isBn = true }: UserProfileModuleProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  return (
    <div className="space-y-6">
      {/* Tab Nav Header */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-primary text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" />
          <span>{isBn ? 'প্রোফাইল তথ্য ও ছবি' : 'Personal Profile'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-primary text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-primary text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>{isBn ? 'শিপিং এড্রেস বুক' : 'Delivery Address Book'}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'profile' && <ProfileModule isBn={isBn} />}
      {activeTab === 'orders' && <MyOrdersSection isBn={isBn} />}
      {activeTab === 'addresses' && <AddressesModule isBn={isBn} />}
    </div>
  );
}
