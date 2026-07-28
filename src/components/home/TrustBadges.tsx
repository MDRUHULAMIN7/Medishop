'use client';

import React from 'react';
import { HOMEPAGE_TRUST_BADGES } from '@/mocks/trust';
import { TrustBadgeCard } from './TrustBadgeCard';

export function TrustBadges() {
  return (
    <section aria-label="Trust Signals" className="w-full py-1">
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
        {HOMEPAGE_TRUST_BADGES.map((badge) => (
          <TrustBadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  );
}
