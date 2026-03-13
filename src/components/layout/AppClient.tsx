'use client';
import dynamic from 'next/dynamic';

// CSR-only — prevents hydration mismatches from browser extensions.
// All SEO metadata lives in layout.tsx (server-rendered), so disabling SSR
// here has no SEO cost.
const App = dynamic(() => import('./App'), { ssr: false });

export default function AppClient() {
    return <App />;
}
