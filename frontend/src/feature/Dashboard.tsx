import { TrendingUp, TrendingDown, Film, ShoppingBag, Receipt, Calendar, DollarSign, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Dashboard() {
  // Mock data cho revenue chart
  const revenueData = [
    { month: "T7", revenue: 12000000, tickets: 450 },
    { month: "T8", revenue: 15000000, tickets: 520 },
    { month: "T9", revenue: 18000000, tickets: 680 },
    { month: "T10", revenue: 22000000, tickets: 750 },
    { month: "T11", revenue: 28000000, tickets: 890 },
    { month: "T12", revenue: 32000000, tickets: 980 },
  ];

  // Stats cards data
  const stats = [
    {
      title: "Doanh thu tháng này",
      value: "32.5 triệu VNĐ",
      change: "+14.2%",
      trend: "up",
      icon: DollarSign,
      color: "#FFC107",
    },
    {
      title: "Vé đã bán",
      value: "980",
      change: "+8.7%",
      trend: "up",
      icon: Receipt,
      color: "#10B981",
    },
    {
      title: "Phim đang chiếu",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Film,
      color: "#8B5CF6",
    },
    {
      title: "Suất chiếu",
      value: "156",
      change: "+12.5%",
      trend: "up",
      icon: Calendar,
      color: "#06B6D4",
    },
  ];

  // Recent movies
  const recentMovies = [
    { id: 1, title: "Avengers: Endgame", genre: "Hành động", duration: "181 phút", status: "Đang chiếu", revenue: "8.5M" },
    { id: 2, title: "Inception", genre: "Khoa học viễn tưởng", duration: "148 phút", status: "Đang chiếu", revenue: "6.2M" },
    { id: 3, title: "The Dark Knight", genre: "Hành động", duration: "152 phút", status: "Đang chiếu", revenue: "7.8M" },
    { id: 4, title: "Parasite", genre: "Kinh dị", duration: "132 phút", status: "Sắp chiếu", revenue: "0M" },
  ];

  // Recent invoices
  const recentInvoices = [
    { id: "#INV-001", customer: "Nguyễn Văn A", amount: "450.000 VNĐ", date: "05/11/2025", status: "Đã thanh toán" },
    { id: "#INV-002", customer: "Trần Thị B", amount: "320.000 VNĐ", date: "05/11/2025", status: "Đã thanh toán" },
    { id: "#INV-003", customer: "Lê Văn C", amount: "680.000 VNĐ", date: "04/11/2025", status: "Đã thanh toán" },
    { id: "#INV-004", customer: "Phạm Thị D", amount: "290.000 VNĐ", date: "04/11/2025", status: "Chờ xử lý" },
  ];

  // Top products
  const topProducts = [
    { name: "Combo 1 - Bắp + Nước", sold: 245, revenue: "12.25M" },
    { name: "Combo 2 - Bắp lớn + 2 Nước", sold: 189, revenue: "15.12M" },
    { name: "Nước ngọt", sold: 156, revenue: "4.68M" },
    { name: "Bắp rang", sold: 134, revenue: "5.36M" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2" style={{ color: '#E5E7EB' }}>Tổng quan</h1>
        <p style={{ color: '#9CA3AF' }}>Chào mừng trở lại! Đây là tổng quan hoạt động của rạp chiếu phim.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
                    stat.trend === "up" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>{stat.title}</p>
                  <p className="text-2xl" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-[#8B5CF6]/20">
          <CardHeader>
            <CardTitle style={{ color: '#E5E7EB' }}>Doanh thu 6 tháng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C253A',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#E5E7EB',
                  }}
                  formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M VNĐ`, 'Doanh thu']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFC107"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tickets Chart */}
        <Card className="border-[#8B5CF6]/20">
          <CardHeader>
            <CardTitle style={{ color: '#E5E7EB' }}>Số vé bán ra</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C253A',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#E5E7EB',
                  }}
                  formatter={(value: any) => [`${value} vé`, 'Số lượng']}
                />
                <Bar dataKey="tickets" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movies */}
        <Card className="border-[#8B5CF6]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: '#E5E7EB' }}>Phim gần đây</CardTitle>
              <button className="text-sm hover:underline" style={{ color: '#8B5CF6' }}>
                Xem tất cả
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                  <TableHead style={{ color: '#9CA3AF' }}>Tên phim</TableHead>
                  <TableHead style={{ color: '#9CA3AF' }}>Trạng thái</TableHead>
                  <TableHead className="text-right" style={{ color: '#9CA3AF' }}>Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMovies.map((movie) => (
                  <TableRow key={movie.id} className="border-[#8B5CF6]/20">
                    <TableCell>
                      <div>
                        <p style={{ color: '#E5E7EB' }}>{movie.title}</p>
                        <p className="text-sm" style={{ color: '#9CA3AF' }}>{movie.genre}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          movie.status === "Đang chiếu"
                            ? "bg-green-500/20 text-green-500 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                        }`}
                      >
                        {movie.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ color: '#FFC107' }}>
                      {movie.revenue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="border-[#8B5CF6]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: '#E5E7EB' }}>Hóa đơn gần đây</CardTitle>
              <button className="text-sm hover:underline" style={{ color: '#8B5CF6' }}>
                Xem tất cả
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                  <TableHead style={{ color: '#9CA3AF' }}>Mã HĐ</TableHead>
                  <TableHead style={{ color: '#9CA3AF' }}>Khách hàng</TableHead>
                  <TableHead className="text-right" style={{ color: '#9CA3AF' }}>Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-[#8B5CF6]/20">
                    <TableCell style={{ color: '#8B5CF6' }}>{invoice.id}</TableCell>
                    <TableCell>
                      <div>
                        <p style={{ color: '#E5E7EB' }}>{invoice.customer}</p>
                        <p className="text-sm" style={{ color: '#9CA3AF' }}>{invoice.date}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ color: '#FFC107' }}>
                      {invoice.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="border-[#8B5CF6]/20">
        <CardHeader>
          <CardTitle style={{ color: '#E5E7EB' }}>Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#0F1629' }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: '#8B5CF6', color: '#E5E7EB' }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p style={{ color: '#E5E7EB' }}>{product.name}</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>Đã bán: {product.sold} sản phẩm</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ color: '#FFC107' }}>{product.revenue}</p>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
