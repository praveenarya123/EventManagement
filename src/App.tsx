import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminMemberships from "./pages/admin/AdminMemberships";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorItems from "./pages/vendor/VendorItems";
import VendorAddItem from "./pages/vendor/VendorAddItem";
import VendorTransactions from "./pages/vendor/VendorTransactions";
import UserDashboard from "./pages/user/UserDashboard";
import UserVendors from "./pages/user/UserVendors";
import UserCart from "./pages/user/UserCart";
import UserGuests from "./pages/user/UserGuests";
import UserOrders from "./pages/user/UserOrders";
import Register from "./pages/Register";
import UserRegister from "./pages/user/UserRegister";
import VendorRegister from "./pages/vendor/VendorRegister";
import AdminRegister from "./pages/admin/AdminRegister";
import RegisterChoice from "./pages/RegisterChoice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterChoice />} />
            <Route path="/register/user" element={<UserRegister />} />
            <Route path="/register/vendor" element={<VendorRegister />} />
            <Route path="/register/admin" element={<AdminRegister />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={["admin"]}><AdminVendors /></ProtectedRoute>} />
            <Route path="/admin/memberships" element={<ProtectedRoute allowedRoles={["admin"]}><AdminMemberships /></ProtectedRoute>} />

            {/* Vendor Routes */}
            <Route path="/vendor" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/items" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorItems /></ProtectedRoute>} />
            <Route path="/vendor/items/new" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorAddItem /></ProtectedRoute>} />
            <Route path="/vendor/transactions" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorTransactions /></ProtectedRoute>} />

            {/* User Routes */}
            <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]}><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/vendors" element={<ProtectedRoute allowedRoles={["user"]}><UserVendors /></ProtectedRoute>} />
            <Route path="/user/cart" element={<ProtectedRoute allowedRoles={["user"]}><UserCart /></ProtectedRoute>} />
            <Route path="/user/guests" element={<ProtectedRoute allowedRoles={["user"]}><UserGuests /></ProtectedRoute>} />
            <Route path="/user/orders" element={<ProtectedRoute allowedRoles={["user"]}><UserOrders /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
