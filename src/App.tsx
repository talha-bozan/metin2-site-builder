import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Public pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Wiki from "./pages/Wiki";
import Support from "./pages/Support";
import EPYukle from "./pages/EPYukle";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin pages (lazy loaded)
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminAccounts = lazy(() => import("./pages/admin/Accounts"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons"));
const AdminEvents = lazy(() => import("./pages/admin/Events"));
const AdminNews = lazy(() => import("./pages/admin/News"));
const AdminPacks = lazy(() => import("./pages/admin/Packs"));
const AdminTickets = lazy(() => import("./pages/admin/Tickets"));
const AdminLogs = lazy(() => import("./pages/admin/Logs"));
const AdminPlayers = lazy(() => import("./pages/admin/Players"));
const AdminProto = lazy(() => import("./pages/admin/Proto"));
const AdminItemGive = lazy(() => import("./pages/admin/ItemGive"));
const AdminSocket = lazy(() => import("./pages/admin/Socket"));
const AdminWiki = lazy(() => import("./pages/admin/WikiAdmin"));
const AdminSettings = lazy(() => import("./pages/admin/SiteSettings"));
const AdminUsers = lazy(() => import("./pages/admin/PanelUsers"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/market" element={<Shop />} />
              <Route path="/giris" element={<Login />} />
              <Route path="/kayit" element={<Register />} />
              <Route path="/etkinlikler" element={<Events />} />
              <Route path="/wiki" element={<Wiki />} />
              <Route path="/destek" element={<Support />} />
              <Route path="/ep-yukle" element={<EPYukle />} />
              <Route path="/profil" element={<Profile />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/hesaplar" element={<AdminAccounts />} />
              <Route path="/admin/urunler" element={<AdminProducts />} />
              <Route path="/admin/kategoriler" element={<AdminCategories />} />
              <Route path="/admin/kuponlar" element={<AdminCoupons />} />
              <Route path="/admin/etkinlikler" element={<AdminEvents />} />
              <Route path="/admin/haberler" element={<AdminNews />} />
              <Route path="/admin/paketler" element={<AdminPacks />} />
              <Route path="/admin/ticketlar" element={<AdminTickets />} />
              <Route path="/admin/loglar" element={<AdminLogs />} />
              <Route path="/admin/oyuncular" element={<AdminPlayers />} />
              <Route path="/admin/proto" element={<AdminProto />} />
              <Route path="/admin/item-ver" element={<AdminItemGive />} />
              <Route path="/admin/socket" element={<AdminSocket />} />
              <Route path="/admin/wiki" element={<AdminWiki />} />
              <Route path="/admin/ayarlar" element={<AdminSettings />} />
              <Route path="/admin/kullanicilar" element={<AdminUsers />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
