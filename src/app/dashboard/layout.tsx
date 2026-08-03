import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin Dashboard Panel | mediShop',
  description: 'Comprehensive Admin Dashboard for mediShop Pharmacy platform.',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-muted/20">{children}</div>;
}
