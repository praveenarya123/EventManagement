import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const vendorData = [
  { id: "1", name: "Elegant Decor", business: "Decoration", items: ["Flower Setup - ₹5,000", "Stage Decor - ₹15,000"] },
  { id: "2", name: "Royal Catering", business: "Catering", items: ["Veg Platter (100 pax) - ₹25,000", "Non-Veg Platter (100 pax) - ₹35,000"] },
  { id: "3", name: "Sound Masters", business: "Audio/DJ", items: ["DJ Package - ₹10,000", "Sound System Rental - ₹8,000"] },
  { id: "4", name: "Click Studio", business: "Photography", items: ["Full Day Photo - ₹20,000", "Photo + Video - ₹40,000"] },
];

const UserVendors = () => {
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Browse Vendors</h1>
          <p className="text-muted-foreground">Select items to add to your cart</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendorData.map((v) => (
            <Card key={v.id} className="shadow-card border-0">
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-heading font-semibold text-lg">{v.name}</h3>
                  <p className="text-sm text-muted-foreground">{v.business}</p>
                </div>
                <div className="space-y-2">
                  {v.items.map((item) => (
                    <div key={item} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{item}</span>
                      <Button size="sm" variant="outline" onClick={() => toast({ title: "Added to cart!", description: item })}>
                        <ShoppingCart className="h-3 w-3 mr-1" />Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserVendors;
