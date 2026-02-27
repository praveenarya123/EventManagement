import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogOut, Home, Package, ShoppingCart, Users, Settings, FileText, List, ClipboardList } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const roleNavItems: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: <Home className="h-4 w-4" /> },
    { label: "Users", path: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { label: "Vendors", path: "/admin/vendors", icon: <Package className="h-4 w-4" /> },
    { label: "Memberships", path: "/admin/memberships", icon: <ClipboardList className="h-4 w-4" /> },
  ],
  vendor: [
    { label: "Dashboard", path: "/vendor", icon: <Home className="h-4 w-4" /> },
    { label: "Your Items", path: "/vendor/items", icon: <Package className="h-4 w-4" /> },
    { label: "Add Item", path: "/vendor/items/new", icon: <Settings className="h-4 w-4" /> },
    { label: "Transactions", path: "/vendor/transactions", icon: <FileText className="h-4 w-4" /> },
  ],
  user: [
    { label: "Dashboard", path: "/user", icon: <Home className="h-4 w-4" /> },
    { label: "Vendors", path: "/user/vendors", icon: <Package className="h-4 w-4" /> },
    { label: "Cart", path: "/user/cart", icon: <ShoppingCart className="h-4 w-4" /> },
    { label: "Guest List", path: "/user/guests", icon: <List className="h-4 w-4" /> },
    { label: "Orders", path: "/user/orders", icon: <ClipboardList className="h-4 w-4" /> },
  ],
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = roleNavItems[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="gradient-hero text-primary-foreground sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <span className="font-heading font-bold text-lg">EMS</span>
            <span className="text-xs bg-primary/30 px-2 py-0.5 rounded-full capitalize ml-2">
              {user.role}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:inline">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/10">
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
        {/* Sub Nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                location.pathname === item.path
                  ? "bg-primary-foreground/20 font-medium"
                  : "hover:bg-primary-foreground/10 text-primary-foreground/70"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
