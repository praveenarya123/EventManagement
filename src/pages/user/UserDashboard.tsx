import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, List, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  { label: "Browse Vendors", desc: "Explore vendor services", icon: <Package className="h-6 w-6" />, path: "/user/vendors" },
  { label: "My Cart", desc: "Items ready for booking", icon: <ShoppingCart className="h-6 w-6" />, path: "/user/cart" },
  { label: "Guest List", desc: "Manage your event guests", icon: <List className="h-6 w-6" />, path: "/user/guests" },
  { label: "Order Status", desc: "Track your orders", icon: <ClipboardList className="h-6 w-6" />, path: "/user/orders" },
];

const UserDashboard = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground">Plan your perfect event</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link to={c.path} key={c.label}>
            <Card className="shadow-card border-0 hover:shadow-elevated transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center text-center gap-3 p-6">
                <div className="p-3 rounded-lg bg-accent/10 text-accent">{c.icon}</div>
                <h3 className="font-heading font-semibold">{c.label}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default UserDashboard;
