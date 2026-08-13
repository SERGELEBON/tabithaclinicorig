import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";
import ProductDetail from "./pages/ProductDetail";
import GlobalCart from "./components/GlobalCart";
import { CartProvider } from "./contexts/CartContext";
import { MessageCircle } from "lucide-react";

function FloatingWhatsApp() {
  return (
    <a
      className="floating-whatsapp"
      href="https://wa.me/233530387812?text=Hello%20Tabitha%20Clinic%2C%20I%20would%20like%20to%20make%20an%20appointment."
      target="_blank"
      rel="noreferrer"
      aria-label="Contact Tabitha Clinic on WhatsApp"
    >
      <MessageCircle size={22} strokeWidth={2.2} />
      <span>Chat on WhatsApp</span>
    </a>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services/:slug" component={ServiceDetail} />
      <Route path="/shop/:slug" component={ProductDetail} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <GlobalCart />
            <FloatingWhatsApp />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
