import { FormEvent, useEffect, useRef, useState } from "react";
import { Users, UserCheck, TrendingUp, DollarSign, Search, Calendar, Award, ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { createCustomer, deleteCustomer, fetchCustomers, fetchEmployees, updateCustomer } from "../api/users";

interface Customer {
  id: string;
  name: string;
  membershipTier: string;
  points: number;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

interface Employee {
  id: string;
  name: string;
  joinDate: string;
  salary: number;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [customerSort, setCustomerSort] = useState<'points' | 'id' | 'name'>('points');
  const [employeeSort, setEmployeeSort] = useState<'salary' | 'id' | 'name'>('salary');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const getInitialFormState = () => ({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    points: '',
  });
  const [formData, setFormData] = useState(getInitialFormState as () => {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    points: string | number;
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setLoading(true);
        const [customerData, employeeData] = await Promise.all([
          fetchCustomers(),
          fetchEmployees(),
        ]);

        if (!isMounted) return;
        setCustomers(customerData);
        setEmployees(employeeData);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu người dùng';
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshCustomers = async () => {
    try {
      const latest = await fetchCustomers();
      setCustomers(latest);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải lại khách hàng';
      setError(message);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingCustomer(null);
    setFormData(getInitialFormState());
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setModalMode('edit');
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      dateOfBirth: customer.dateOfBirth || '',
      points: customer.points ?? 0,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
    setSaving(false);
  };

  const handleFormChange = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Tên khách hàng là bắt buộc.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Số điện thoại là bắt buộc.');
      return;
    }

    setSaving(true);
    try {
      if (modalMode === 'create') {
        await createCustomer({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          points: Number(formData.points) || 0,
        });
      } else if (editingCustomer) {
        await updateCustomer(editingCustomer.id, {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          points: Number(formData.points) || 0,
        });
      }
      await refreshCustomers();
      handleCloseModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể lưu khách hàng';
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa khách hàng ${customer.name}?`);
    if (!confirmed) return;

    setDeleteTarget(customer.id);
    try {
      await deleteCustomer(customer.id);
      await refreshCustomers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xóa khách hàng';
      setError(message);
    } finally {
      setDeleteTarget(null);
    }
  };

  // helper to compare IDs: try numeric comparison of digits in id, fallback to localeCompare
  const compareById = (aId: string, bId: string) => {
    const aNumMatch = aId.match(/\d+/);
    const bNumMatch = bId.match(/\d+/);
    if (aNumMatch && bNumMatch) {
      const aNum = parseInt(aNumMatch[0], 10);
      const bNum = parseInt(bNumMatch[0], 10);
      return aNum - bNum;
    }
    return aId.localeCompare(bId, undefined, { numeric: true, sensitivity: 'base' });
  };

  // Sorted customers based on user selection
  const sortedCustomers = [...customers].sort((a, b) => {
    if (customerSort === 'points') return b.points - a.points;
    if (customerSort === 'name') return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
    return compareById(a.id, b.id);
  });

  const formatDateDisplay = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Sorted employees based on user selection
  const sortedEmployees = [...employees].sort((a, b) => {
    if (employeeSort === 'salary') return b.salary - a.salary;
    if (employeeSort === 'name') return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
    return compareById(a.id, b.id);
  });

  // Filter customers
  const filteredCustomers = sortedCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter employees
  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMembershipBadge = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return (
          <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">
            <Award className="w-3 h-3 mr-1" />
            Platinum
          </Badge>
        );
      case "Gold":
        return (
          <Badge className="bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30">
            <Award className="w-3 h-3 mr-1" />
            Gold
          </Badge>
        );
      case "Silver":
        return (
          <Badge className="bg-[#C0C0C0]/20 text-[#C0C0C0] border-[#C0C0C0]/30">
            <Award className="w-3 h-3 mr-1" />
            Silver
          </Badge>
        );
      case "Bronze":
        return (
          <Badge className="bg-[#CD7F32]/20 text-[#CD7F32] border-[#CD7F32]/30">
            <Award className="w-3 h-3 mr-1" />
            Bronze
          </Badge>
        );
      default:
        return null;
    }
  };

  const customerStats = (() => {
    const total = customers.length;
    const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
    const averagePoints = total ? Math.round(totalPoints / total) : 0;
    const platinum = customers.filter((c) => c.membershipTier === "Platinum").length;
    const gold = customers.filter((c) => c.membershipTier === "Gold").length;
    const silver = customers.filter((c) => c.membershipTier === "Silver").length;
    return { total, totalPoints, averagePoints, platinum, gold, silver };
  })();

  const employeeStats = (() => {
    const total = employees.length;
    const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
    const averageSalary = total ? Math.round(totalSalary / total) : 0;
    const recent = employees.filter((e) => {
      const parts = e.joinDate.split("/");
      const year = parseInt(parts[2], 10);
      return Number.isFinite(year) && year >= 2023;
    }).length;
    return { total, totalSalary, averageSalary, recent };
  })();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2" style={{ color: "#E5E7EB" }}>
          Quản lý người dùng
        </h1>
        <p style={{ color: "#9CA3AF" }}>
          Quản lý thông tin khách hàng và nhân viên
        </p>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 rounded-lg">
          Không thể tải dữ liệu: {error}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0F1629] border border-[#8B5CF6]/20 rounded-full p-1 inline-flex gap-1">
          <TabsTrigger
            value="customers"
            className={
              `rounded-full px-4 py-2 flex items-center gap-2 text-sm transition whitespace-nowrap ` +
              (activeTab === "customers"
                ? "bg-[#8B5CF6] text-white shadow-lg"
                : "text-[#9CA3AF] hover:bg-[#0F1629]/40")
            }
          >
            <Users className="w-4 h-4" />
            Khách hàng
          </TabsTrigger>
          <TabsTrigger
            value="employees"
            className={
              `rounded-full px-4 py-2 flex items-center gap-2 text-sm transition whitespace-nowrap ` +
              (activeTab === "employees"
                ? "bg-[#8B5CF6] text-white shadow-lg"
                : "text-[#9CA3AF] hover:bg-[#0F1629]/40")
            }
          >
            <UserCheck className="w-4 h-4" />
            Nhân viên
          </TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6 mt-6">
          {loading && (
            <div className="text-center text-sm" style={{ color: "#9CA3AF" }}>
              Đang tải dữ liệu khách hàng...
            </div>
          )}
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#8B5CF620" }}
                  >
                    <Users className="w-6 h-6" style={{ color: "#8B5CF6" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Tổng khách hàng
                  </p>
                  <p className="text-2xl" style={{ color: "#8B5CF6" }}>
                    {customerStats.total}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#EF444420" }}
                  >
                    <TrendingUp className="w-6 h-6" style={{ color: "#EF4444" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Tổng điểm tích lũy
                  </p>
                  <p className="text-2xl" style={{ color: "#EF4444" }}>
                    {customerStats.totalPoints.toLocaleString("vi-VN")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#FFC10720" }}
                  >
                    <Award className="w-6 h-6" style={{ color: "#FFC107" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Số khách hạng Gold
                  </p>
                  <p className="text-2xl" style={{ color: "#FFC107" }}>
                    {customerStats.gold}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#10B98120" }}
                  >
                    <Award className="w-6 h-6" style={{ color: "#10B981" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Số khách hạng Platinum
                  </p>
                  <p className="text-2xl" style={{ color: "#10B981" }}>
                    {customerStats.platinum}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customers Table */}
          <Card className="border-[#8B5CF6]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: "#E5E7EB" }}>
                  Danh sách khách hàng
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleOpenCreateModal}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Thêm khách hàng
                  </Button>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                    <Select
                      value={customerSort}
                      onValueChange={(value: "points" | "id" | "name") => setCustomerSort(value)}
                    >
                      <SelectTrigger className="w-44 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                        <SelectItem
                          value="points"
                          className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                        >
                          Sắp xếp theo điểm
                        </SelectItem>
                        <SelectItem
                          value="name"
                          className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                        >
                          Sắp xếp theo tên
                        </SelectItem>
                        <SelectItem
                          value="id"
                          className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                        >
                          Sắp xếp theo ID
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative w-64">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "#9CA3AF" }}
                    />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm khách hàng..."
                      className="pl-10 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-4" style={{ color: "#9CA3AF" }}>
                💡 Sắp xếp theo điểm tích lũy (cao → thấp)
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                    <TableHead style={{ color: "#9CA3AF" }}>ID</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Tên khách hàng</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Email</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Ngày sinh</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Số điện thoại</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Hạng thành viên</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Điểm tích lũy</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }} className="text-right">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="border-[#8B5CF6]/20">
                      <TableCell style={{ color: "#8B5CF6" }}>
                        {customer.id}
                      </TableCell>
                      <TableCell style={{ color: "#E5E7EB" }}>
                        {customer.name}
                      </TableCell>
                      <TableCell style={{ color: "#9CA3AF" }}>
                        {customer.email || "-"}
                      </TableCell>
                      <TableCell style={{ color: "#9CA3AF" }}>
                        {formatDateDisplay(customer.dateOfBirth)}
                      </TableCell>
                      <TableCell style={{ color: "#9CA3AF" }}>
                        {customer.phone || "-"}
                      </TableCell>
                      <TableCell>
                        {getMembershipBadge(customer.membershipTier)}
                      </TableCell>
                      <TableCell style={{ color: "#FFC107" }}>
                        {customer.points.toLocaleString("vi-VN")} điểm
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                            className="bg-transparent border border-[#8B5CF6]/40 text-[#E5E7EB] hover:bg-[#8B5CF6]/20"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer)}
                            disabled={deleteTarget === customer.id}
                            className="bg-red-500/20 text-red-200 border border-red-400/40 hover:bg-red-500/40 disabled:opacity-70"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {deleteTarget === customer.id ? 'Đang xóa...' : 'Xóa'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredCustomers.length === 0 && (
                <div className="text-center py-8" style={{ color: "#9CA3AF" }}>
                  Không tìm thấy khách hàng nào
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6 mt-6">
          {loading && (
            <div className="text-center text-sm" style={{ color: "#9CA3AF" }}>
              Đang tải dữ liệu nhân viên...
            </div>
          )}
          {/* Employee Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#8B5CF620" }}
                  >
                    <UserCheck className="w-6 h-6" style={{ color: "#8B5CF6" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Tổng nhân viên
                  </p>
                  <p className="text-2xl" style={{ color: "#8B5CF6" }}>
                    {employeeStats.total}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#FFC10720" }}
                  >
                    <DollarSign className="w-6 h-6" style={{ color: "#FFC107" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Tổng quỹ lương
                  </p>
                  <p className="text-2xl" style={{ color: "#FFC107" }}>
                    {(employeeStats.totalSalary / 1000000).toFixed(0)}tr
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#10B98120" }}
                  >
                    <TrendingUp className="w-6 h-6" style={{ color: "#10B981" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    Lương TB/người
                  </p>
                  <p className="text-2xl" style={{ color: "#10B981" }}>
                    {(employeeStats.averageSalary / 1000000).toFixed(1)}tr
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#8B5CF6]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#3B82F620" }}
                  >
                    <Calendar className="w-6 h-6" style={{ color: "#3B82F6" }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                    NV mới (2023+)
                  </p>
                  <p className="text-2xl" style={{ color: "#3B82F6" }}>
                    {employeeStats.recent}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employees Table */}
          <Card className="border-[#8B5CF6]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: "#E5E7EB" }}>
                  Danh sách nhân viên
                </CardTitle>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                    <Select
                      value={employeeSort}
                      onValueChange={(value: "salary" | "id" | "name") => setEmployeeSort(value)}
                    >
                      <SelectTrigger className="w-44 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                        <SelectItem
                          value="salary"
                          className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                        >
                          Sắp xếp theo lương
                        </SelectItem>
                        <SelectItem
                          value="name"
                          className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                        >
                          Sắp xếp theo tên
                        </SelectItem>
                        <SelectItem
                          value="id"
                          className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                        >
                          Sắp xếp theo ID
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative w-64">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "#9CA3AF" }}
                    />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm nhân viên..."
                      className="pl-10 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-4" style={{ color: "#9CA3AF" }}>
                💡 Sắp xếp theo lương (cao → thấp)
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                    <TableHead style={{ color: "#9CA3AF" }}>ID</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Tên nhân viên</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Ngày gia nhập</TableHead>
                    <TableHead style={{ color: "#9CA3AF" }}>Lương</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="border-[#8B5CF6]/20">
                      <TableCell style={{ color: "#8B5CF6" }}>
                        {employee.id}
                      </TableCell>
                      <TableCell style={{ color: "#E5E7EB" }}>
                        {employee.name}
                      </TableCell>
                      <TableCell style={{ color: "#9CA3AF" }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {employee.joinDate}
                        </div>
                      </TableCell>
                      <TableCell style={{ color: "#FFC107" }}>
                        {employee.salary.toLocaleString("vi-VN")}₫
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredEmployees.length === 0 && (
                <div className="text-center py-8" style={{ color: "#9CA3AF" }}>
                  Không tìm thấy nhân viên nào
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent className="bg-[#0F1629] border border-[#8B5CF6]/30 text-white">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'Thêm khách hàng mới' : 'Cập nhật khách hàng'}
            </DialogTitle>
          </DialogHeader>
          <form ref={formRef} className="space-y-4" onSubmit={handleSubmitCustomer}>
            <div className="space-y-2">
              <Label htmlFor="customer-name" className="text-[#E5E7EB]">
                Họ tên *
              </Label>
              <Input
                id="customer-name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Nhập họ tên khách hàng"
                className="bg-[#1C253A] border-[#8B5CF6]/30"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-phone" className="text-[#E5E7EB]">
                  Số điện thoại *
                </Label>
                <Input
                  id="customer-phone"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="bg-[#1C253A] border-[#8B5CF6]/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email" className="text-[#E5E7EB]">
                  Email
                </Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="Nhập email"
                  className="bg-[#1C253A] border-[#8B5CF6]/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-dob" className="text-[#E5E7EB]">
                  Ngày sinh
                </Label>
                <Input
                  id="customer-dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                  className="bg-[#1C253A] border-[#8B5CF6]/30"
                />
                {modalMode === 'edit' && editingCustomer && (
                  <p className="text-xs text-[#9CA3AF]">
                    Hạng hiện tại: <span className="font-semibold text-white">{editingCustomer.membershipTier}</span> (tự động từ trigger)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-points" className="text-[#E5E7EB]">
                  Điểm tích lũy
                </Label>
                <Input
                  id="customer-points"
                  type="number"
                  min={0}
                  value={formData.points as any}
                  onFocus={() => {
                    if (formData.points === 0) handleFormChange('points', '');
                  }}
                  onChange={(e) => handleFormChange('points', e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-[#1C253A] border-[#8B5CF6]/30"
                />
              </div>
            </div>
            {formError && (
              <p className="text-sm text-red-400">{formError}</p>
            )}
            <DialogFooter className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                className="bg-transparent border border-[#8B5CF6]/40 text-[#E5E7EB] hover:bg-[#8B5CF6]/20"
                onClick={handleCloseModal}
              >
                Hủy
              </Button>
              {modalMode === 'create' && (
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-transparent border border-[#8B5CF6]/40 text-[#E5E7EB] hover:bg-[#8B5CF6]/20"
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Xác nhận đã thêm'}
                </Button>
              )}
              {modalMode === 'edit' && (
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-transparent border border-[#8B5CF6]/40 text-[#E5E7EB] hover:bg-[#8B5CF6]/20"
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Xác nhận đã cập nhật'}
                </Button>
              )}
              <Button
                type="submit"
                className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Xác nhận'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
