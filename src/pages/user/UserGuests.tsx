import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Guest {
  id: string;
  name: string;
  email: string;
  attending: boolean;
}

const initialGuests: Guest[] = [
  { id: "1", name: "Rahul Verma", email: "rahul@example.com", attending: true },
  { id: "2", name: "Priya Singh", email: "priya@example.com", attending: false },
  { id: "3", name: "Amit Joshi", email: "amit@example.com", attending: true },
];

const UserGuests = () => {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setGuests([...guests, { id: Date.now().toString(), name, email, attending: false }]);
    setName(""); setEmail("");
    toast({ title: "Guest added" });
  };

  const toggleAttending = (id: string) => {
    setGuests(guests.map((g) => g.id === id ? { ...g, attending: !g.attending } : g));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Guest List</h1>
          <p className="text-muted-foreground">Manage your event guest list</p>
        </div>
        <Card className="shadow-card border-0">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Label>Guest Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-1" />Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Attending</TableHead>
                  <TableHead className="text-right">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell>{g.email}</TableCell>
                    <TableCell>
                      <Checkbox checked={g.attending} onCheckedChange={() => toggleAttending(g.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setGuests(guests.filter((x) => x.id !== g.id)); toast({ title: "Guest removed" }); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

export default UserGuests;
