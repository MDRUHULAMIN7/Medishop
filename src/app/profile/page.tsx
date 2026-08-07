'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfileModule } from '@/components/profile/UserProfileModule';
import { ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/store';

export default function ProfilePage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">{isBn ? 'মাই প্রোফাইল ও ঠিকানা' : 'My Profile & Addresses'}</span>
        </nav>

        {/* Profile & Address Container Module */}
        <UserProfileModule isBn={isBn} />
      </div>
    </div>
  );
}
