import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Events from "./pages/Events.tsx";
import Wiki from "./pages/Wiki.tsx";
import Support from "./pages/Support.tsx";
import EPYukle from "./pages/EPYukle.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/market" element={<Shop />} />
            <Route path="/giris" element={<Login />} />
            <Route path="/kayit" element={<Register />} />
            <Route path="/etkinlikler" element={<Events />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/destek" element={<Support />} />
            <Route path="/ep-yukle" element={<EPYukle />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
