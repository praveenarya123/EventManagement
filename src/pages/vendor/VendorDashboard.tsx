import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Package, FileText, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  { label: "Your Items", desc: "Manage your products and services", icon: <Package className="h-6 w-6" />, path: "/vendor/items" },
  { label: "Add New Item", desc: "List a new product or service", icon: <ShoppingCart className="h-6 w-6" />, path: "/vendor/items/new" },
  { label: "Transactions", desc: "View user requests and orders", icon: <FileText className="h-6 w-6" />, path: "/vendor/transactions" },
];

const VendorDashboard = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Manage your items and transactions</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link to={c.path} key={c.label}>
            <Card className="shadow-card border-0 hover:shadow-elevated transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center text-center gap-3 p-6">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">{c.icon}</div>
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

export default VendorDashboard;
