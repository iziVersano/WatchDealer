import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../store/authSlice';
import { selectFilteredWatches } from '../store/watchSlice';
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
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Users } from "lucide-react";

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
  const watches = useSelector(selectFilteredWatches);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [materialData, setMaterialData] = useState<{name: string, value: number}[]>([]);
  const [sizeData, setSizeData] = useState<{size: string, count: number}[]>([]);

  // Redirect if not admin
  useEffect(() => {
    if (isAdmin === false) {
      setLocation('/');
    }
  }, [isAdmin, setLocation]);

  // Process watch data for analytics
  useEffect(() => {
    if (watches.length > 0) {
      // Generate material distribution data
      const materialCounts: Record<string, number> = {};
      watches.forEach(watch => {
        materialCounts[watch.material] = (materialCounts[watch.material] || 0) + 1;
      });
      
      const materialChartData = Object.entries(materialCounts).map(([name, value]) => ({
        name,
        value: Math.round((value / watches.length) * 100)
      }));
      setMaterialData(materialChartData);

      // Generate size distribution data
      const sizeCounts: Record<string, number> = {};
      watches.forEach(watch => {
        const sizeKey = `${watch.size}mm`;
        sizeCounts[sizeKey] = (sizeCounts[sizeKey] || 0) + 1;
      });
      
      const sizeChartData = Object.entries(sizeCounts).map(([size, count]) => ({
        size,
        count
      }));
      setSizeData(sizeChartData);
    }
  }, [watches]);

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Sales Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Total Sales
            </CardTitle>
            <div className="absolute top-3 right-3 text-neutral-400">
              <TrendingUp size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">$1,234,567</div>
            )}
            <p className="text-xs text-emerald-500 dark:text-emerald-400">
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
            <div className="absolute top-3 right-3 text-neutral-400">
              <BarChart3 size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{watches.length || 143}</div>
            )}
            <p className="text-xs text-emerald-500 dark:text-emerald-400">
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
            <div className="absolute top-3 right-3 text-neutral-400">
              <PieChartIcon size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">$26,325</div>
            )}
            <p className="text-xs text-emerald-500 dark:text-emerald-400">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>
        
        {/* Acquisition Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Customer Leads
            </CardTitle>
            <div className="absolute top-3 right-3 text-neutral-400">
              <Users size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">52</div>
            )}
            <p className="text-xs text-emerald-500 dark:text-emerald-400">
              +8 new leads this week
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
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                  <Area type="monotone" dataKey="sales" stroke="#8884d8" fillOpacity={1} fill="url(#salesGradient)" />
                </AreaChart>
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

        {/* Watch Case Size Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Watch Case Size Distribution</CardTitle>
            <CardDescription>
              Inventory breakdown by case diameter
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
                  data={sizeData.length > 0 ? sizeData : [
                    { size: '36mm', count: 12 },
                    { size: '38mm', count: 18 },
                    { size: '39mm', count: 22 },
                    { size: '40mm', count: 35 },
                    { size: '41mm', count: 26 },
                    { size: '42mm', count: 15 },
                    { size: '44mm', count: 8 },
                    { size: '45mm', count: 4 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="size" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Watches']} />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
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
                  <Bar dataKey="sales" fill="#FF8042" />
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
