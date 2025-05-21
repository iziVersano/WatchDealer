import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../store/authSlice';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3 } from "lucide-react";

// Mock data for the charts
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
  { month: 'Jul', sales: 3490 },
  { month: 'Aug', sales: 4000 },
  { month: 'Sep', sales: 2780 },
  { month: 'Oct', sales: 1890 },
  { month: 'Nov', sales: 2390 },
  { month: 'Dec', sales: 3490 },
];

const brandData = [
  { name: 'Rolex', value: 40 },
  { name: 'Patek Philippe', value: 15 },
  { name: 'Omega', value: 20 },
  { name: 'Audemars Piguet', value: 10 },
  { name: 'Cartier', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminAnalyticsPage() {
  const [location, setLocation] = useLocation();
  const isAdmin = useSelector(selectIsAdmin);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (isAdmin === false) {
      setLocation('/');
    }
  }, [isAdmin, setLocation]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isAdmin) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 dark:text-neutral-100">
          Sales Analytics
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          View sales performance and inventory insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Sales Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">$1,234,567</div>
            )}
            <p className="text-xs text-muted-foreground">
              +14.2% from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Listings Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">143</div>
            )}
            <p className="text-xs text-muted-foreground">
              +4 new listings this week
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">$26,325</div>
            )}
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Monthly Sales Chart */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>
              Sales performance over the past 12 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                  <Bar dataKey="sales" fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Brand Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Distribution</CardTitle>
            <CardDescription>
              Sales breakdown by watch brand
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {brandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Popular Price Ranges Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Price Ranges</CardTitle>
            <CardDescription>
              Distribution of sales by price range
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { range: '$0-$10k', sales: 15 },
                    { range: '$10k-$25k', sales: 30 },
                    { range: '$25k-$50k', sales: 25 },
                    { range: '$50k-$100k', sales: 20 },
                    { range: '$100k+', sales: 10 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="range" type="category" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Sales']} />
                  <Bar dataKey="sales" fill="var(--chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Insights</CardTitle>
          <CardDescription>
            Key observations from recent sales data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <ul className="space-y-2 ml-6 list-disc">
              <li>Rolex continues to be the top-selling brand, accounting for 40% of all sales.</li>
              <li>The $10,000-$25,000 price range is the most popular among customers.</li>
              <li>Sales have increased by 14.2% compared to the previous month.</li>
              <li>Stainless steel watches are outperforming gold models by 2:1 in total sales.</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
