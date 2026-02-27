import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ClipboardList, Activity } from "lucide-react";

const stats = [
  { label: "Total Users", value: "128", icon: <Users className="h-5 w-5" />, color: "text-primary" },
  { label: "Active Vendors", value: "34", icon: <Package className="h-5 w-5" />, color: "text-accent" },
  { label: "Memberships", value: "56", icon: <ClipboardList className="h-5 w-5" />, color: "text-success" },
  { label: "Events Active", value: "12", icon: <Activity className="h-5 w-5" />, color: "text-warning" },
];

const AdminDashboard = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Maintenance Menu — Admin access only</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-0">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`p-3 rounded-lg bg-muted ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-heading font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card border-0">
          <CardHeader><CardTitle className="text-base">Recent Users</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Praveen Kumar", "Anjali Sharma", "Ravi Patel"].map((n) => (
              <div key={n} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{n}</span>
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Active</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardHeader><CardTitle className="text-base">Recent Vendors</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Elegant Decor", "Royal Catering", "Sound Masters"].map((n) => (
              <div key={n} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{n}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Verified</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminDashboard;
