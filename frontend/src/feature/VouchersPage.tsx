import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Ticket, Calendar, TrendingUp, PercentCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface Voucher {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discount: number;
  remaining: number;
  issueDate: string;
  expiryDate: string;
  status: "active" | "expired" | "depleted";
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: "VOU001",
      code: "CINEMA2024",
      discountType: "percentage",
      discount: 20,
      remaining: 150,
      issueDate: "01/11/2025",
      expiryDate: "31/12/2025",
      status: "active",
    },
    {
      id: "VOU002",
      code: "NEWYEAR50K",
      discountType: "fixed",
      discount: 50000,
      remaining: 45,
      issueDate: "15/10/2025",
      expiryDate: "15/01/2026",
      status: "active",
    },
    {
      id: "VOU003",
      code: "WEEKEND30",
      discountType: "percentage",
      discount: 30,
      remaining: 0,
      issueDate: "10/10/2025",
      expiryDate: "10/11/2025",
      status: "depleted",
    },
    {
      id: "VOU004",
      code: "HALLOWEEN",
      discountType: "fixed",
      discount: 25000,
      remaining: 5,
      issueDate: "20/09/2025",
      expiryDate: "01/11/2025",
      status: "expired",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discount: "",
    remaining: "",
    issueDate: "",
    expiryDate: "",
  });

  const stats = [
    {
      title: "Tổng voucher",
      value: vouchers.length.toString(),
      icon: Ticket,
      color: "#FFC107",
    },
    {
      title: "Đang hoạt động",
      value: vouchers.filter(v => v.status === "active").length.toString(),
      icon: TrendingUp,
      color: "#10B981",
    },
    {
      title: "Giảm theo %",
      value: vouchers.filter(v => v.discountType === "percentage").length.toString(),
      icon: PercentCircle,
      color: "#8B5CF6",
    },
    {
      title: "Giảm cố định",
      value: vouchers.filter(v => v.discountType === "fixed").length.toString(),
      icon: DollarSign,
      color: "#F59E0B",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVoucher) {
      // Update existing voucher
      setVouchers(vouchers.map(v => 
        v.id === editingVoucher.id 
          ? {
              ...v,
              code: formData.code,
              discountType: formData.discountType,
              discount: Number(formData.discount),
              remaining: Number(formData.remaining),
              issueDate: formData.issueDate,
              expiryDate: formData.expiryDate,
              status: getVoucherStatus(formData.expiryDate, Number(formData.remaining)),
            }
          : v
      ));
    } else {
      // Add new voucher
      const newVoucher: Voucher = {
        id: `VOU${String(vouchers.length + 1).padStart(3, '0')}`,
        code: formData.code,
        discountType: formData.discountType,
        discount: Number(formData.discount),
        remaining: Number(formData.remaining),
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        status: getVoucherStatus(formData.expiryDate, Number(formData.remaining)),
      };
      setVouchers([...vouchers, newVoucher]);
    }

    resetForm();
  };

  const getVoucherStatus = (expiryDate: string, remaining: number): "active" | "expired" | "depleted" => {
    if (remaining === 0) return "depleted";
    const [day, month, year] = expiryDate.split('/').map(Number);
    const expiry = new Date(year, month - 1, day);
    const today = new Date();
    if (expiry < today) return "expired";
    return "active";
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      discountType: voucher.discountType,
      discount: voucher.discount.toString(),
      remaining: voucher.remaining.toString(),
      issueDate: voucher.issueDate,
      expiryDate: voucher.expiryDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      setVouchers(vouchers.filter(v => v.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discount: "",
      remaining: "",
      issueDate: "",
      expiryDate: "",
    });
    setEditingVoucher(null);
    setIsDialogOpen(false);
  };

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === "percentage") {
      return `${voucher.discount}%`;
    } else {
      return `${voucher.discount.toLocaleString('vi-VN')}₫`;
    }
  };

  const filteredVouchers = vouchers.filter(v =>
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Đang hoạt động</Badge>;
      case "expired":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Hết hạn</Badge>;
      case "depleted":
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Hết số lượng</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#E5E7EB' }}>Phát hành voucher</h1>
          <p style={{ color: '#9CA3AF' }}>Quản lý mã giảm giá và voucher cho khách hàng</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629] shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm voucher mới
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30">
            <DialogHeader>
              <DialogTitle style={{ color: '#E5E7EB' }}>
                {editingVoucher ? "Chỉnh sửa voucher" : "Thêm voucher mới"}
              </DialogTitle>
              <DialogDescription style={{ color: '#9CA3AF' }}>
                {editingVoucher ? "Cập nhật thông tin voucher" : "Tạo mã giảm giá mới cho khách hàng"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã voucher</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: CINEMA2024"
                  required
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Loại giảm giá</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: "percentage" | "fixed") => 
                    setFormData({ ...formData, discountType: value, discount: "" })
                  }
                >
                  <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                    <SelectItem value="percentage" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                      Giảm theo phần trăm (%)
                    </SelectItem>
                    <SelectItem value="fixed" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                      Giảm cố định (VNĐ)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">
                    {formData.discountType === "percentage" ? "Mức giảm (%)" : "Số tiền giảm (VNĐ)"}
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max={formData.discountType === "percentage" ? "100" : undefined}
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder={formData.discountType === "percentage" ? "20" : "50000"}
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remaining">Số lượng</Label>
                  <Input
                    id="remaining"
                    type="number"
                    min="0"
                    value={formData.remaining}
                    onChange={(e) => setFormData({ ...formData, remaining: e.target.value })}
                    placeholder="100"
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Ngày phát hành</Label>
                  <Input
                    id="issueDate"
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/10"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629]"
                >
                  {editingVoucher ? "Cập nhật" : "Thêm voucher"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
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

      {/* Vouchers Table */}
      <Card className="border-[#8B5CF6]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#E5E7EB' }}>Danh sách voucher</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm voucher..."
                className="pl-10 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                <TableHead style={{ color: '#9CA3AF' }}>ID</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Mã voucher</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Loại</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Mã giảm</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Còn lại</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Ngày phát hành</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Ngày hết hạn</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Trạng thái</TableHead>
                <TableHead className="text-right" style={{ color: '#9CA3AF' }}>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((voucher) => (
                <TableRow key={voucher.id} className="border-[#8B5CF6]/20">
                  <TableCell style={{ color: '#8B5CF6' }}>{voucher.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" style={{ color: '#FFC107' }} />
                      <span style={{ color: '#E5E7EB' }}>{voucher.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {voucher.discountType === "percentage" ? (
                      <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                        <PercentCircle className="w-3 h-3 mr-1" />
                        Phần trăm
                      </Badge>
                    ) : (
                      <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Cố định
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell style={{ color: '#FFC107' }}>{formatDiscount(voucher)}</TableCell>
                  <TableCell style={{ color: '#E5E7EB' }}>{voucher.remaining}</TableCell>
                  <TableCell style={{ color: '#9CA3AF' }}>{voucher.issueDate}</TableCell>
                  <TableCell style={{ color: '#9CA3AF' }}>{voucher.expiryDate}</TableCell>
                  <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="p-2 rounded-lg transition-all hover:bg-[#8B5CF6]/20"
                        style={{ color: '#8B5CF6' }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="p-2 rounded-lg transition-all hover:bg-red-500/20"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredVouchers.length === 0 && (
            <div className="text-center py-8" style={{ color: '#9CA3AF' }}>
              Không tìm thấy voucher nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
