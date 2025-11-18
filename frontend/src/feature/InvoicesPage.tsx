import { useState } from "react";
import { Receipt, Plus, Edit, Eye, CreditCard, Search, DollarSign, TrendingUp, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";

type PaymentMethod = "Tiền mặt" | "Thẻ tín dụng" | "Ví điện tử" | "Chuyển khoản";
type PaymentStatus = "Chưa thanh toán" | "Đã thanh toán" | "Đã hủy";

interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  employeeId: string;
  employeeName: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: InvoiceItem[];
  totalAmount: number;
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "all">("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    employeeId: "",
    employeeName: "",
    paymentMethod: "Tiền mặt" as PaymentMethod,
    paymentStatus: "Chưa thanh toán" as PaymentStatus,
  });

  // TODO: Replace with actual database query
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "HD001",
      createdAt: "2024-01-15 14:30:00",
      customerId: "KH001",
      customerName: "Nguyễn Văn An",
      employeeId: "NV001",
      employeeName: "Nguyễn Thị Mai",
      paymentMethod: "Tiền mặt",
      paymentStatus: "Đã thanh toán",
      items: [
        {
          productId: "SP001",
          productName: "Bắp rang bơ",
          quantity: 2,
          unitPrice: 45000,
          totalPrice: 90000,
        },
        {
          productId: "SP004",
          productName: "Coca Cola",
          quantity: 2,
          unitPrice: 25000,
          totalPrice: 50000,
        },
      ],
      totalAmount: 140000,
    },
    {
      id: "HD002",
      createdAt: "2024-01-15 15:45:00",
      customerId: "KH002",
      customerName: "Trần Thị Bình",
      employeeId: "NV002",
      employeeName: "Trần Văn Bình",
      paymentMethod: "Thẻ tín dụng",
      paymentStatus: "Đã thanh toán",
      items: [
        {
          productId: "SP008",
          productName: "Combo Solo",
          quantity: 1,
          unitPrice: 85000,
          totalPrice: 85000,
        },
      ],
      totalAmount: 85000,
    },
    {
      id: "HD003",
      createdAt: "2024-01-15 16:20:00",
      customerId: "KH003",
      customerName: "Lê Hoàng Cường",
      employeeId: "NV001",
      employeeName: "Nguyễn Thị Mai",
      paymentMethod: "Ví điện tử",
      paymentStatus: "Đã thanh toán",
      items: [
        {
          productId: "SP009",
          productName: "Combo Couple",
          quantity: 1,
          unitPrice: 150000,
          totalPrice: 150000,
        },
        {
          productId: "SP003",
          productName: "Nachos phô mai",
          quantity: 1,
          unitPrice: 65000,
          totalPrice: 65000,
        },
      ],
      totalAmount: 215000,
    },
    {
      id: "HD004",
      createdAt: "2024-01-15 17:10:00",
      customerId: "KH004",
      customerName: "Phạm Thị Dung",
      employeeId: "NV003",
      employeeName: "Lê Thị Cẩm",
      paymentMethod: "Tiền mặt",
      paymentStatus: "Chưa thanh toán",
      items: [
        {
          productId: "SP001",
          productName: "Bắp rang bơ",
          quantity: 1,
          unitPrice: 45000,
          totalPrice: 45000,
        },
        {
          productId: "SP005",
          productName: "Pepsi",
          quantity: 1,
          unitPrice: 25000,
          totalPrice: 25000,
        },
      ],
      totalAmount: 70000,
    },
    {
      id: "HD005",
      createdAt: "2024-01-15 18:00:00",
      customerId: "KH005",
      customerName: "Hoàng Văn Em",
      employeeId: "NV002",
      employeeName: "Trần Văn Bình",
      paymentMethod: "Chuyển khoản",
      paymentStatus: "Đã hủy",
      items: [
        {
          productId: "SP010",
          productName: "Combo Family",
          quantity: 1,
          unitPrice: 280000,
          totalPrice: 280000,
        },
      ],
      totalAmount: 280000,
    },
    {
      id: "HD006",
      createdAt: "2024-01-15 19:30:00",
      customerId: "KH006",
      customerName: "Vũ Thị Phương",
      employeeId: "NV004",
      employeeName: "Phạm Minh Đức",
      paymentMethod: "Thẻ tín dụng",
      paymentStatus: "Đã thanh toán",
      items: [
        {
          productId: "SP002",
          productName: "Bắp rang caramel",
          quantity: 3,
          unitPrice: 50000,
          totalPrice: 150000,
        },
        {
          productId: "SP007",
          productName: "Trà xanh C2",
          quantity: 3,
          unitPrice: 12000,
          totalPrice: 36000,
        },
      ],
      totalAmount: 186000,
    },
    {
      id: "HD007",
      createdAt: "2024-01-16 10:15:00",
      customerId: "KH007",
      customerName: "Đặng Minh Giang",
      employeeId: "NV001",
      employeeName: "Nguyễn Thị Mai",
      paymentMethod: "Ví điện tử",
      paymentStatus: "Đã thanh toán",
      items: [
        {
          productId: "SP008",
          productName: "Combo Solo",
          quantity: 2,
          unitPrice: 85000,
          totalPrice: 170000,
        },
      ],
      totalAmount: 170000,
    },
    {
      id: "HD008",
      createdAt: "2024-01-16 14:20:00",
      customerId: "KH008",
      customerName: "Bùi Thị Hà",
      employeeId: "NV005",
      employeeName: "Hoàng Thị Lan",
      paymentMethod: "Tiền mặt",
      paymentStatus: "Chưa thanh toán",
      items: [
        {
          productId: "SP004",
          productName: "Coca Cola",
          quantity: 1,
          unitPrice: 25000,
          totalPrice: 25000,
        },
        {
          productId: "SP006",
          productName: "Nước suối Aquafina",
          quantity: 1,
          unitPrice: 15000,
          totalPrice: 15000,
        },
      ],
      totalAmount: 40000,
    },
  ]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || invoice.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Đã thanh toán":
        return (
          <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">
            ✓ Đã thanh toán
          </Badge>
        );
      case "Chưa thanh toán":
        return (
          <Badge className="bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30">
            ⏳ Chưa thanh toán
          </Badge>
        );
      case "Đã hủy":
        return (
          <Badge className="bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30">
            ✕ Đã hủy
          </Badge>
        );
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "Tiền mặt":
        return "💵";
      case "Thẻ tín dụng":
        return "💳";
      case "Ví điện tử":
        return "📱";
      case "Chuyển khoản":
        return "🏦";
    }
  };

  const stats = {
    total: invoices.length,
    totalRevenue: invoices
      .filter((inv) => inv.paymentStatus === "Đã thanh toán")
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
    paid: invoices.filter((inv) => inv.paymentStatus === "Đã thanh toán").length,
    pending: invoices.filter((inv) => inv.paymentStatus === "Chưa thanh toán").length,
    cancelled: invoices.filter((inv) => inv.paymentStatus === "Đã hủy").length,
  };

  const handleOpenEditDialog = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      employeeId: invoice.employeeId,
      employeeName: invoice.employeeName,
      paymentMethod: invoice.paymentMethod,
      paymentStatus: invoice.paymentStatus,
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingInvoice(null);
  };

  const handleSaveInvoice = () => {
    // TODO: Save to database
    if (editingInvoice) {
      const updatedInvoice = {
        ...editingInvoice,
        customerId: formData.customerId,
        customerName: formData.customerName,
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
      };
      setInvoices(invoices.map((inv) => (inv.id === editingInvoice.id ? updatedInvoice : inv)));
    }
    handleCloseEditDialog();
  };

  const handleViewDetails = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: "#E5E7EB" }}>
            Quản lý hóa đơn
          </h1>
          <p style={{ color: "#9CA3AF" }}>
            Quản lý và theo dõi hóa đơn bán hàng
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#8B5CF620" }}>
                <Receipt className="w-6 h-6" style={{ color: "#8B5CF6" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Tổng hóa đơn
              </p>
              <p className="text-2xl" style={{ color: "#8B5CF6" }}>
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#FFC10720" }}>
                <DollarSign className="w-6 h-6" style={{ color: "#FFC107" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Tổng doanh thu
              </p>
              <p className="text-2xl" style={{ color: "#FFC107" }}>
                {(stats.totalRevenue / 1000000).toFixed(1)}tr
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#10B98120" }}>
                <TrendingUp className="w-6 h-6" style={{ color: "#10B981" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Đã thanh toán
              </p>
              <p className="text-2xl" style={{ color: "#10B981" }}>
                {stats.paid}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#FFC10720" }}>
                <CreditCard className="w-6 h-6" style={{ color: "#FFC107" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Chưa thanh toán
              </p>
              <p className="text-2xl" style={{ color: "#FFC107" }}>
                {stats.pending}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#EF444420" }}>
                <XCircle className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Đã hủy
              </p>
              <p className="text-2xl" style={{ color: "#EF4444" }}>
                {stats.cancelled}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-[#8B5CF6]/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#9CA3AF" }}
              />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm hóa đơn..."
                className="pl-10 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value: PaymentStatus | "all") => setFilterStatus(value)}
            >
              <SelectTrigger className="w-56 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                <SelectItem value="all" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem value="Đã thanh toán" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  ✓ Đã thanh toán
                </SelectItem>
                <SelectItem value="Chưa thanh toán" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  ⏳ Chưa thanh toán
                </SelectItem>
                <SelectItem value="Đã hủy" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  ✕ Đã hủy
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border-[#8B5CF6]/20">
        <CardHeader>
          <CardTitle style={{ color: "#E5E7EB" }}>Danh sách hóa đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                <TableHead style={{ color: "#9CA3AF" }}>ID Hóa đơn</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Thời gian tạo</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Khách hàng</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Nhân viên</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Phương thức</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Trạng thái</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Tổng tiền</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-[#8B5CF6]/20">
                  <TableCell style={{ color: "#8B5CF6" }}>{invoice.id}</TableCell>
                  <TableCell style={{ color: "#9CA3AF" }}>
                    {invoice.createdAt}
                  </TableCell>
                  <TableCell style={{ color: "#E5E7EB" }}>
                    <div>{invoice.customerName}</div>
                    <div className="text-sm" style={{ color: "#9CA3AF" }}>
                      {invoice.customerId}
                    </div>
                  </TableCell>
                  <TableCell style={{ color: "#E5E7EB" }}>
                    <div>{invoice.employeeName}</div>
                    <div className="text-sm" style={{ color: "#9CA3AF" }}>
                      {invoice.employeeId}
                    </div>
                  </TableCell>
                  <TableCell style={{ color: "#E5E7EB" }}>
                    {getPaymentMethodIcon(invoice.paymentMethod)} {invoice.paymentMethod}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.paymentStatus)}</TableCell>
                  <TableCell style={{ color: "#FFC107" }}>
                    {invoice.totalAmount.toLocaleString("vi-VN")}₫
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(invoice)}
                        className="hover:bg-[#3B82F6]/20"
                      >
                        <Eye className="w-4 h-4" style={{ color: "#3B82F6" }} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditDialog(invoice)}
                        className="hover:bg-[#8B5CF6]/20"
                      >
                        <Edit className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8" style={{ color: "#9CA3AF" }}>
              Không tìm thấy hóa đơn nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: "#E5E7EB" }}>
              Chỉnh sửa hóa đơn {editingInvoice?.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFC10710", borderLeft: "4px solid #FFC107" }}>
              <p className="text-sm" style={{ color: "#FFC107" }}>
                ⓘ Thời gian tạo và chi tiết sản phẩm không thể chỉnh sửa
              </p>
            </div>

            <div>
              <Label style={{ color: "#9CA3AF" }}>Thời gian tạo</Label>
              <Input
                value={editingInvoice?.createdAt || ""}
                disabled
                className="bg-[#0F1629]/50 border-[#8B5CF6]/20 mt-2 cursor-not-allowed"
                style={{ color: "#6B7280" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerId" style={{ color: "#E5E7EB" }}>
                  Khách hàng ID
                </Label>
                <Input
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                />
              </div>
              <div>
                <Label htmlFor="customerName" style={{ color: "#E5E7EB" }}>
                  Tên khách hàng
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId" style={{ color: "#E5E7EB" }}>
                  Nhân viên ID
                </Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                />
              </div>
              <div>
                <Label htmlFor="employeeName" style={{ color: "#E5E7EB" }}>
                  Tên nhân viên
                </Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod" style={{ color: "#E5E7EB" }}>
                Phương thức thanh toán
              </Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: PaymentMethod) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                  <SelectItem value="Tiền mặt" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                    💵 Tiền mặt
                  </SelectItem>
                  <SelectItem value="Thẻ tín dụng" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                    💳 Thẻ tín dụng
                  </SelectItem>
                  <SelectItem value="Ví điện tử" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                    📱 Ví điện tử
                  </SelectItem>
                  <SelectItem value="Chuyển khoản" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                    🏦 Chuyển khoản
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentStatus" style={{ color: "#E5E7EB" }}>
                Trạng thái thanh toán
              </Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value: PaymentStatus) =>
                  setFormData({ ...formData, paymentStatus: value })
                }
              >
                <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                  <SelectItem value="Chưa thanh toán" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                    ⏳ Chưa thanh toán
                  </SelectItem>
                  <SelectItem value="Đã thanh toán" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                    ✓ Đã thanh toán
                  </SelectItem>
                  <SelectItem value="Đã hủy" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                    ✕ Đã hủy
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseEditDialog}
              className="border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveInvoice}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30 max-w-3xl">
          <DialogHeader>
            <DialogTitle style={{ color: "#E5E7EB" }}>
              Chi tiết hóa đơn {viewingInvoice?.id}
            </DialogTitle>
          </DialogHeader>

          {viewingInvoice && (
            <div className="space-y-6 py-4">
              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#0F1629" }}>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Thời gian tạo
                  </p>
                  <p style={{ color: "#E5E7EB" }}>{viewingInvoice.createdAt}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#0F1629" }}>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Trạng thái
                  </p>
                  {getStatusBadge(viewingInvoice.paymentStatus)}
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#0F1629" }}>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Khách hàng
                  </p>
                  <p style={{ color: "#E5E7EB" }}>{viewingInvoice.customerName}</p>
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>
                    {viewingInvoice.customerId}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#0F1629" }}>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Nhân viên
                  </p>
                  <p style={{ color: "#E5E7EB" }}>{viewingInvoice.employeeName}</p>
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>
                    {viewingInvoice.employeeId}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="mb-3" style={{ color: "#FFC107" }}>
                  Chi tiết sản phẩm
                </h4>
                <div className="rounded-lg border" style={{ borderColor: "#8B5CF6" }}>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                        <TableHead style={{ color: "#9CA3AF" }}>ID Sản phẩm</TableHead>
                        <TableHead style={{ color: "#9CA3AF" }}>Tên sản phẩm</TableHead>
                        <TableHead style={{ color: "#9CA3AF" }}>Số lượng</TableHead>
                        <TableHead style={{ color: "#9CA3AF" }}>Đơn giá</TableHead>
                        <TableHead style={{ color: "#9CA3AF" }}>Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingInvoice.items.map((item, index) => (
                        <TableRow key={index} className="border-[#8B5CF6]/20">
                          <TableCell style={{ color: "#8B5CF6" }}>
                            {item.productId}
                          </TableCell>
                          <TableCell style={{ color: "#E5E7EB" }}>
                            {item.productName}
                          </TableCell>
                          <TableCell style={{ color: "#E5E7EB" }}>
                            {item.quantity}
                          </TableCell>
                          <TableCell style={{ color: "#9CA3AF" }}>
                            {item.unitPrice.toLocaleString("vi-VN")}₫
                          </TableCell>
                          <TableCell style={{ color: "#FFC107" }}>
                            {item.totalPrice.toLocaleString("vi-VN")}₫
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#8B5CF620" }}>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Tổng cộng
                  </p>
                  <p className="text-2xl" style={{ color: "#FFC107" }}>
                    {viewingInvoice.totalAmount.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
