@@ .. @@
-'use client';
-
-import { useState } from 'react';
+import { useState } from 'react'
+import { Routes, Route } from 'react-router-dom'
 import { useUser } from '@/contexts/UserContext';
 import { TopMenu } from '@/components/TopMenu';
 import { FooterSlim } from '@/components/FooterSlim';
@@ .. @@
 import { Button } from '@/components/ui/button';
 import { List, Plus } from 'lucide-react';
 import { UpsellModal } from '@/components/UpsellModal';
+import AccountLayout from '@/pages/AccountLayout';
+import AccountPage from '@/pages/AccountPage';
+import ContactPage from '@/pages/ContactPage';
+import PrintPage from '@/pages/PrintPage';
+import PrivacyPage from '@/pages/PrivacyPage';
+import TermsPage from '@/pages/TermsPage';

 type ViewMode = 'saved-claims' | 'claim-form';

-function AppContent() {
+function HomePage() {
   const { user, setUser, canCreateClaim, incrementClaimCount } = useUser();
@@ .. @@
   return (
     <div className="min-h-screen flex flex-col">
       <TopMenu />
       <main className="container mx-auto px-4 pt-20 md:pt-24 pb-12 flex-1">
@@ .. @@
   );
 }

-export default function HomeClient() {
+export default function App() {
   return (
-    <AppContent />
+    <Routes>
+      <Route path="/" element={<HomePage />} />
+      <Route path="/account" element={<AccountLayout><AccountPage /></AccountLayout>} />
+      <Route path="/contact" element={<ContactPage />} />
+      <Route path="/print" element={<PrintPage />} />
+      <Route path="/privacy" element={<PrivacyPage />} />
+      <Route path="/terms" element={<TermsPage />} />
+    </Routes>
   );
 }