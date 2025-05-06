"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Download, Loader2, Printer } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any; // Using any for demonstration; in a real app, use a proper type
  isLoading: boolean;
  onDownload: () => void;
  isDownloading?: boolean;
}

export function InvoiceDetailModal({
  isOpen,
  onClose,
  invoice,
  isLoading,
  onDownload,
  isDownloading = false,
}: InvoiceDetailsModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Simulate preparing for print
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  if (isLoading || !invoice) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice #{invoice.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Issued on {format(new Date(invoice.createdAt), "MMMM dd, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with logo and info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl">DorukWell</h3>
              <p className="text-sm text-muted-foreground">
                GPSR Compliance Services
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(invoice.createdAt), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customer details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">Billed To</h4>
              <p>{invoice.billingAddress.name}</p>
              {invoice.billingAddress.company && <p>{invoice.billingAddress.company}</p>}
              <p>{invoice.billingAddress.address}</p>
              <p>{invoice.billingAddress.city}, {invoice.billingAddress.postalCode}</p>
              <p>{invoice.billingAddress.country}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Payment Information</h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <p className="text-muted-foreground">Status:</p>
                <p className={invoice.status === 'paid' ? 'text-green-600 font-medium' : 
                                invoice.status === 'pending' ? 'text-amber-600 font-medium' : 
                                'text-red-600 font-medium'}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </p>
                <p className="text-muted-foreground">Transaction ID:</p>
                <p className="break-words">{invoice.transaction_id || invoice.transactionId}</p>
                <p className="text-muted-foreground">Payment Method:</p>
                <p>{invoice.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Invoice items */}
          <div>
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="border rounded-md">
              <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Quantity</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              
              {invoice.items.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-12 p-3 text-sm border-t">
                  <div className="col-span-6">{item.description}</div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.amount, invoice.currency)}
                  </div>
                </div>
              ))}
              
              <div className="p-3 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-sm mt-1">
                    <span>Tax</span>
                    <span>{formatCurrency(invoice.tax, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-muted/30 p-3 rounded-md text-sm">
              <h4 className="font-semibold mb-1">Notes</h4>
              <p className="text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            Print
          </Button>
          <Button 
            className="flex-1"
            onClick={onDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}