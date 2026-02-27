import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const transactions = [
  { id: "T001", user: "Praveen Kumar", item: "Flower Arrangement - Premium", amount: 5000, date: "2026-02-20", status: "completed" },
  { id: "T002", user: "Anjali Sharma", item: "Stage Setup - Gold", amount: 15000, date: "2026-02-22", status: "pending" },
  { id: "T003", user: "Ravi Patel", item: "LED Light Package", amount: 8000, date: "2026-02-25", status: "requested" },
];

const VendorTransactions = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Transactions</h1>
        <p className="text-muted-foreground">User requests and completed orders</p>
      </div>
      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-sm">{t.id}</TableCell>
                  <TableCell>{t.user}</TableCell>
                  <TableCell>{t.item}</TableCell>
                  <TableCell>{t.amount.toLocaleString()}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === "completed" ? "bg-success/10 text-success" :
                      t.status === "pending" ? "bg-warning/10 text-warning" :
                      "bg-primary/10 text-primary"
                    }`}>{t.status}</span>
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

export default VendorTransactions;
