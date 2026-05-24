import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { AppShell } from './pages/AppShell'
import { CatalogsPage } from './pages/CatalogsPage'
import { CompanyAuthPage } from './pages/CompanyAuthPage'
import { CompanyDashboardPage } from './pages/CompanyDashboardPage'
import { CompanyDesignsPage } from './pages/CompanyDesignsPage'
import { LoginPage } from './pages/LoginPage'
import { PlanPage } from './pages/PlanPage'
import { PortalPage } from './pages/PortalPage'
import { PricingPage } from './pages/PricingPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ProductsPage } from './pages/ProductsPage'
import { PublicCatalogPage } from './pages/PublicCatalogPage'
import { ReportsPage } from './pages/ReportsPage'
import { RepresentativeAuthPage } from './pages/RepresentativeAuthPage'
import { RepresentativeDashboardPage } from './pages/RepresentativeDashboardPage'
import { RepresentationFirmDashboardPage } from './pages/RepresentationFirmDashboardPage'
import { RepresentativesPage } from './pages/RepresentativesPage'
import { SettingsPage } from './pages/SettingsPage'
import { SignupPage } from './pages/SignupPage'
import { SurfaceRedirect } from './pages/SurfaceRedirect'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SurfaceRedirect />} />
      <Route path="/portal" element={<PortalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/empresa/login" element={<CompanyAuthPage />} />
      <Route path="/empresa/cadastro" element={<CompanyAuthPage />} />
      <Route path="/representante/login" element={<RepresentativeAuthPage />} />
      <Route path="/representante/cadastro" element={<RepresentativeAuthPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/c/:catalogSlug" element={<PublicCatalogPage />} />
      <Route path="/c/:catalogSlug/:shareCode" element={<PublicCatalogPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<CompanyDashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="catalogs" element={<CatalogsPage />} />
        <Route path="designs" element={<CompanyDesignsPage />} />
        <Route path="representatives" element={<RepresentativesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="plan" element={<PlanPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/rep" element={<RepresentativeDashboardPage />} />
      <Route path="/rep-firm" element={<RepresentationFirmDashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/dev" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  )
}

export default App
