import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "available" | "sold" | "pending";
}

const initialItems: Item[] = [
  { id: "1", name: "Flower Arrangement - Premium", category: "Decoration", price: 5000, status: "available" },
  { id: "2", name: "Stage Setup - Gold", category: "Decoration", price: 15000, status: "available" },
  { id: "3", name: "LED Light Package", category: "Lighting", price: 8000, status: "pending" },
];

const VendorItems = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Your Items</h1>
            <p className="text-muted-foreground">View, edit, and delete your listed items</p>
          </div>
          <Link to="/vendor/items/new">
            <Button>Add New Item</Button>
          </Link>
        </div>
        <Card className="shadow-card border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === "available" ? "bg-success/10 text-success" :
                        item.status === "pending" ? "bg-warning/10 text-warning" :
                        "bg-muted text-muted-foreground"
                      }`}>{item.status}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setItems(items.filter((i) => i.id !== item.id)); toast({ title: "Item deleted" }); }}>
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

export default VendorItems;
