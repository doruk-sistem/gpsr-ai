"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";

export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  created_at: string;
  payment_method: string;
  transaction_id: string;
  customer_name: string;
  customer_email: string;
  pdf_url?: string;
}

interface FetchInvoicesParams {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export const useInvoices = (params: FetchInvoicesParams = {}) => {
  const {
    startDate,
    endDate,
    status,
    search,
    page = 1,
    pageSize = 10,
    sortBy = 'created_at',
    sortDirection = 'desc'
  } = params;

  return useQuery({
    queryKey: ['invoices', startDate, endDate, status, search, page, pageSize, sortBy, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from('stripe_user_orders')
        .select('*, stripe_customers!inner(user_id)', { count: 'exact' });
      
      // Apply date filters
      if (startDate) {
        const startDateString = format(startDate, 'yyyy-MM-dd');
        query = query.gte('order_date', startDateString);
      }
      
      if (endDate) {
        const endDateString = format(endDate, 'yyyy-MM-dd');
        query = query.lte('order_date', endDateString);
      }
      
      // Apply status filter
      if (status && status !== 'all') {
        query = query.eq('order_status', status);
      }
      
      // Apply search filter (on invoice_id or payment_intent_id)
      if (search && search.trim() !== '') {
        query = query.or(`payment_intent_id.ilike.%${search}%,checkout_session_id.ilike.%${search}%`);
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      // Transform data into Invoice objects
      const invoices: Invoice[] = data.map((order: any) => ({
        id: order.order_id,
        invoice_number: order.payment_intent_id.substring(3, 11).toUpperCase(),
        amount: order.amount_total / 100, // Convert cents to dollars/pounds
        currency: order.currency,
        status: order.payment_status === 'paid' ? 'paid' : 
                order.payment_status === 'pending' ? 'pending' : 'failed',
        created_at: order.order_date,
        payment_method: 'Card', // Default value, might come from actual data
        transaction_id: order.payment_intent_id,
        customer_name: 'Customer', // Would come from actual customer data
        customer_email: 'customer@example.com', // Would come from actual customer data
        pdf_url: `/api/invoices/${order.payment_intent_id}/pdf`, // Mock URL for PDF
      }));
      
      return {
        invoices,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInvoicePdf = (invoiceId: string) => {
  return useQuery({
    queryKey: ['invoice-pdf', invoiceId],
    queryFn: async () => {
      // In a real implementation, this would make a request to generate/fetch the PDF
      // For now, we'll mock this functionality
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        url: `/api/invoices/${invoiceId}/pdf`,
        filename: `invoice-${invoiceId}.pdf`
      };
    },
    enabled: !!invoiceId,
  });
};

export const useInvoiceDetails = (invoiceId: string) => {
  return useQuery({
    queryKey: ['invoice-details', invoiceId],
    queryFn: async () => {
      // In a real implementation, this would fetch detailed invoice data
      // For demo purposes, we'll return mock data
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .eq('payment_intent_id', invoiceId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.order_id,
        invoiceNumber: data.payment_intent_id.substring(3, 11).toUpperCase(),
        amount: data.amount_total / 100,
        currency: data.currency.toUpperCase(),
        status: data.payment_status,
        createdAt: data.order_date,
        paymentMethod: 'Card ****1234', // Mock data
        billingAddress: {
          name: 'John Doe',
          company: 'Example Inc.',
          address: '123 Main St',
          city: 'Anytown',
          postalCode: '12345',
          country: 'United Kingdom'
        },
        items: [
          {
            description: 'GPSR Subscription',
            quantity: 1,
            unitPrice: data.amount_total / 100,
            amount: data.amount_total / 100
          }
        ],
        subtotal: data.amount_subtotal / 100,
        tax: (data.amount_total - data.amount_subtotal) / 100,
        total: data.amount_total / 100,
        notes: 'Thank you for your business!'
      };
    },
    enabled: !!invoiceId,
  });
};

export const useExportInvoices = (format: 'csv' | 'pdf') => {
  return useMutation({
    mutationFn: async (filters: FetchInvoicesParams) => {
      // In a real implementation, this would make a request to generate the export
      // For now, we'll simulate this with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return a mock URL for the exported file
      return {
        url: `/api/invoices/export?format=${format}`,
        filename: `invoices-export-${new Date().toISOString().split('T')[0]}.${format}`
      };
    }
  });
};