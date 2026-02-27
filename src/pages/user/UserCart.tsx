import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
}

const initialCart: CartItem[] = [
  { id: "1", name: "Flower Setup", vendor: "Elegant Decor", price: 5000 },
  { id: "2", name: "Veg Platter (100 pax)", vendor: "Royal Catering", price: 25000 },
  { id: "3", name: "DJ Package", vendor: "Sound Masters", price: 10000 },
];

const UserCart = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const { toast } = useToast();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Your Cart</h1>
          <p className="text-muted-foreground">Review and proceed to payment</p>
        </div>
        <Card className="shadow-card border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead className="text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setCart(cart.filter((c) => c.id !== item.id)); toast({ title: "Item removed" }); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-heading font-bold">₹{total.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setCart([]); toast({ title: "Cart cleared" }); }}>Cancel</Button>
              <Button onClick={() => toast({ title: "Payment initiated!", description: `Total: ₹${total.toLocaleString()}` })}>Proceed to Payment</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserCart;
