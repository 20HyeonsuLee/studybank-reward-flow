
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudyManagement from "./pages/StudyManagement";
import StudySearch from "./pages/StudySearch";
import StudyDetail from "./pages/StudyDetail";
import MogakcoRooms from "./pages/MogakcoRooms";
import MogakcoRoom from "./pages/MogakcoRoom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/study-management" element={<StudyManagement />} />
          <Route path="/study-search" element={<StudySearch />} />
          <Route path="/study-detail/:studyId" element={<StudyDetail />} />
          <Route path="/mogakco" element={<MogakcoRooms />} />
          <Route path="/mogakco/:roomId" element={<MogakcoRoom />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
