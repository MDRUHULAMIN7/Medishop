'use client';

import Link from 'next/link';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-muted/20 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-background p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-black">404</div>
        <h1 className="mt-5 font-serif-title text-2xl font-black text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The MediShop page you’re looking for is unavailable.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white"><Home className="h-4 w-4" /> Back to Home</Link>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-xs font-bold text-foreground hover:bg-muted"><ShoppingBag className="h-4 w-4" /> Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
