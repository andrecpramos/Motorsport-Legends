import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import GullwingPage from './pages/GullwingPage.tsx'
import { CookieBanner } from './components/ui/CookieBanner.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { PageLoader } from './components/ui/PageLoader.tsx'
import { useGLTF } from '@react-three/drei'

// Point useGLTF at our self-hosted Draco decoder so compressed GLBs load correctly
useGLTF.setDecoderPath('/draco/')

// Lazy-load car pages so only the active page's 3D assets are bundled per route
const HomePage    = lazy(() => import('./pages/HomePage.tsx'))
const FerrariPage  = lazy(() => import('./pages/FerrariPage.tsx'))
const JaguarPage   = lazy(() => import('./pages/JaguarPage.tsx'))
const MclarenPage  = lazy(() => import('./pages/MclarenPage.tsx'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.tsx'))
const TermsPage   = lazy(() => import('./pages/TermsPage.tsx'))
const AdminPage       = lazy(() => import('./pages/AdminPage.tsx'))
const RivalryPage     = lazy(() => import('./pages/RivalryPage.tsx'))
const Porsche911Page  = lazy(() => import('./pages/Porsche911Page.tsx'))
const Porsche917kPage = lazy(() => import('./pages/Porsche917kPage.tsx'))
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Skip-to-content link — visually hidden until focused by keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-background focus:text-accent focus:border focus:border-accent/60 focus:font-body focus:text-xs focus:tracking-widest focus:uppercase"
        >
          Skip to content
        </a>
        <Suspense fallback={<PageLoader />}>
          <main id="main-content">
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/mercedes" element={<GullwingPage />} />
            <Route path="/ferrari"  element={<FerrariPage />} />
            <Route path="/jaguar"   element={<JaguarPage />} />
            <Route path="/mclaren"  element={<MclarenPage />} />
            <Route path="/privacy"  element={<PrivacyPage />} />
            <Route path="/terms"    element={<TermsPage />} />
            <Route path="/admin"            element={<AdminPage />} />
            <Route path="/rivalry/:slug"   element={<RivalryPage />} />
            <Route path="/porsche911"      element={<Porsche911Page />} />
            <Route path="/porsche917k"    element={<Porsche917kPage />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
          </main>
        </Suspense>
        {/* Cookie consent banner — shown once across all routes */}
        <CookieBanner />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
