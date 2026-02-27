import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
  id: string;
  name: string;
  business: string;
  contact: string;
  status: "active" | "inactive";
}

const initialVendors: Vendor[] = [
  { id: "1", name: "Elegant Decor", business: "Decoration", contact: "decor@example.com", status: "active" },
  { id: "2", name: "Royal Catering", business: "Catering", contact: "catering@example.com", status: "active" },
  { id: "3", name: "Sound Masters", business: "Audio/DJ", contact: "sound@example.com", status: "inactive" },
];

const AdminVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState({ name: "", business: "", contact: "", status: "active" as "active" | "inactive" });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.name.trim() || !form.business.trim()) {
      toast({ title: "Validation Error", description: "Name and Business are required.", variant: "destructive" });
      return;
    }
    if (editing) {
      setVendors(vendors.map((v) => (v.id === editing.id ? { ...v, ...form } : v)));
      toast({ title: "Vendor updated" });
    } else {
      setVendors([...vendors, { id: Date.now().toString(), ...form }]);
      toast({ title: "Vendor added" });
    }
    setOpen(false);
    setEditing(null);
    setForm({ name: "", business: "", contact: "", status: "active" });
  };

  const handleEdit = (v: Vendor) => {
    setEditing(v);
    setForm({ name: v.name, business: v.business, contact: v.contact, status: v.status });
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Vendor Management</h1>
            <p className="text-muted-foreground">Manage vendor accounts and businesses</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm({ name: "", business: "", contact: "", status: "active" }); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" />Add Vendor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Vendor</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Business Type</Label><Input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} /></div>
                <div className="space-y-2"><Label>Contact</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Vendor</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.business}</TableCell>
                    <TableCell>{v.contact}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${v.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{v.status}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(v)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setVendors(vendors.filter((x) => x.id !== v.id)); toast({ title: "Vendor deleted" }); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default AdminVendors;
