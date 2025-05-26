"use client";

import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data
const chartData = {
  weekly: [
    { name: "Mon", users: 20, products: 12, requests: 5 },
    { name: "Tue", users: 25, products: 15, requests: 8 },
    { name: "Wed", users: 18, products: 10, requests: 7 },
    { name: "Thu", users: 22, products: 14, requests: 9 },
    { name: "Fri", users: 28, products: 18, requests: 11 },
    { name: "Sat", users: 15, products: 8, requests: 4 },
    { name: "Sun", users: 12, products: 6, requests: 3 }
  ],
  monthly: [
    { name: "Week 1", users: 120, products: 80, requests: 35 },
    { name: "Week 2", users: 140, products: 90, requests: 42 },
    { name: "Week 3", users: 110, products: 75, requests: 30 },
    { name: "Week 4", users: 160, products: 95, requests: 50 }
  ],
  yearly: [
    { name: "Jan", users: 400, products: 240, requests: 120 },
    { name: "Feb", users: 420, products: 260, requests: 130 },
    { name: "Mar", users: 450, products: 280, requests: 140 },
    { name: "Apr", users: 480, products: 300, requests: 150 },
    { name: "May", users: 520, products: 320, requests: 160 },
    { name: "Jun", users: 560, products: 340, requests: 170 },
    { name: "Jul", users: 590, products: 360, requests: 180 },
    { name: "Aug", users: 620, products: 380, requests: 190 },
    { name: "Sep", users: 650, products: 400, requests: 200 },
    { name: "Oct", users: 680, products: 420, requests: 210 },
    { name: "Nov", users: 710, products: 440, requests: 220 },
    { name: "Dec", users: 750, products: 460, requests: 230 }
  ]
};

export function DashboardChart() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [chartType, setChartType] = useState("bar");
  
  // Get the appropriate data based on the selected time range
  const data = chartData[timeRange as keyof typeof chartData];
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" name="New Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="products" name="Products" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="requests" name="Rep Requests" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" name="New Users" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="products" name="Products" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="requests" name="Rep Requests" stroke="#F97316" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}