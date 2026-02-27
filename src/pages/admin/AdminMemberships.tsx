import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Membership {
  id: string;
  vendorName: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired";
}

const initialMemberships: Membership[] = [
  { id: "1", vendorName: "Elegant Decor", plan: "Premium", startDate: "2026-01-01", endDate: "2026-12-31", status: "active" },
  { id: "2", vendorName: "Royal Catering", plan: "Basic", startDate: "2025-06-01", endDate: "2026-05-31", status: "active" },
  { id: "3", vendorName: "Sound Masters", plan: "Premium", startDate: "2024-01-01", endDate: "2024-12-31", status: "expired" },
];

const AdminMemberships = () => {
  const [memberships, setMemberships] = useState<Membership[]>(initialMemberships);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Membership | null>(null);
  const [form, setForm] = useState({ vendorName: "", plan: "Basic", startDate: "", endDate: "" });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.vendorName.trim() || !form.startDate || !form.endDate) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    if (editing) {
      setMemberships(memberships.map((m) => (m.id === editing.id ? { ...m, ...form, status: new Date(form.endDate) > new Date() ? "active" : "expired" } : m)));
      toast({ title: "Membership updated" });
    } else {
      setMemberships([...memberships, { id: Date.now().toString(), ...form, status: new Date(form.endDate) > new Date() ? "active" : "expired" }]);
      toast({ title: "Membership added" });
    }
    setOpen(false);
    setEditing(null);
    setForm({ vendorName: "", plan: "Basic", startDate: "", endDate: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Memberships</h1>
            <p className="text-muted-foreground">Add and update vendor memberships</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm({ vendorName: "", plan: "Basic", startDate: "", endDate: "" }); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" />Add Membership</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Update" : "Add"} Membership</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Vendor Name</Label><Input value={form.vendorName} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberships.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.vendorName}</TableCell>
                    <TableCell>{m.plan}</TableCell>
                    <TableCell>{m.startDate}</TableCell>
                    <TableCell>{m.endDate}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{m.status}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(m); setForm({ vendorName: m.vendorName, plan: m.plan, startDate: m.startDate, endDate: m.endDate }); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setMemberships(memberships.filter((x) => x.id !== m.id)); toast({ title: "Deleted" }); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
};

export default AdminMemberships;
