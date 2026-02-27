import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const orders = [
  { id: "ORD-001", items: "Flower Setup, DJ Package", total: 15000, date: "2026-02-20", status: "confirmed" },
  { id: "ORD-002", items: "Veg Platter (100 pax)", total: 25000, date: "2026-02-22", status: "processing" },
  { id: "ORD-003", items: "Full Day Photo", total: 20000, date: "2026-02-25", status: "pending" },
];

const UserOrders = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Order Status</h1>
        <p className="text-muted-foreground">Track your bookings</p>
      </div>
      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-sm">{o.id}</TableCell>
                  <TableCell>{o.items}</TableCell>
                  <TableCell>{o.total.toLocaleString()}</TableCell>
                  <TableCell>{o.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      o.status === "confirmed" ? "bg-success/10 text-success" :
                      o.status === "processing" ? "bg-warning/10 text-warning" :
                      "bg-primary/10 text-primary"
                    }`}>{o.status}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default UserOrders;
