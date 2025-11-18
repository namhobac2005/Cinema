import { useState } from "react";
import { Package, Plus, Edit, Trash2, ShoppingBag, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";

type ProductCategory = "Thức Ăn" | "Nước uống" | "Combo";

interface BaseProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  supplier: string;
  category: ProductCategory;
}

interface FoodProduct extends BaseProduct {
  category: "Thức Ăn";
  weight: number; // gram
  flavor: string;
}

interface DrinkProduct extends BaseProduct {
  category: "Nước uống";
  volume: number; // ml
  hasGas: boolean;
}

interface ComboProduct extends BaseProduct {
  category: "Combo";
  description: string;
}

type Product = FoodProduct | DrinkProduct | ComboProduct;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<ProductCategory | "all">("all");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    supplier: "",
    category: "Thức Ăn" as ProductCategory,
    // Food specific
    weight: "",
    flavor: "",
    // Drink specific
    volume: "",
    hasGas: false,
    // Combo specific
    description: "",
  });

  // TODO: Replace with actual database query
  const [products, setProducts] = useState<Product[]>([
    {
      id: "SP001",
      name: "Bắp rang bơ",
      price: 45000,
      stock: 150,
      supplier: "Sunshine Foods",
      category: "Thức Ăn",
      weight: 120,
      flavor: "Bơ",
    },
    {
      id: "SP002",
      name: "Bắp rang caramel",
      price: 50000,
      stock: 120,
      supplier: "Sunshine Foods",
      category: "Thức Ăn",
      weight: 120,
      flavor: "Caramel",
    },
    {
      id: "SP003",
      name: "Nachos phô mai",
      price: 65000,
      stock: 80,
      supplier: "Snack Master",
      category: "Thức Ăn",
      weight: 150,
      flavor: "Phô mai",
    },
    {
      id: "SP004",
      name: "Coca Cola",
      price: 25000,
      stock: 200,
      supplier: "Coca Cola Vietnam",
      category: "Nước uống",
      volume: 500,
      hasGas: true,
    },
    {
      id: "SP005",
      name: "Pepsi",
      price: 25000,
      stock: 180,
      supplier: "PepsiCo Vietnam",
      category: "Nước uống",
      volume: 500,
      hasGas: true,
    },
    {
      id: "SP006",
      name: "Nước suối Aquafina",
      price: 15000,
      stock: 250,
      supplier: "PepsiCo Vietnam",
      category: "Nước uống",
      volume: 500,
      hasGas: false,
    },
    {
      id: "SP007",
      name: "Trà xanh C2",
      price: 12000,
      stock: 160,
      supplier: "URC Vietnam",
      category: "Nước uống",
      volume: 330,
      hasGas: false,
    },
    {
      id: "SP008",
      name: "Combo Solo",
      price: 85000,
      stock: 50,
      supplier: "CinemaHub",
      category: "Combo",
      description: "1 Bắp rang bơ + 1 Nước ngọt",
    },
    {
      id: "SP009",
      name: "Combo Couple",
      price: 150000,
      stock: 45,
      supplier: "CinemaHub",
      category: "Combo",
      description: "2 Bắp rang caramel + 2 Nước ngọt",
    },
    {
      id: "SP010",
      name: "Combo Family",
      price: 280000,
      stock: 30,
      supplier: "CinemaHub",
      category: "Combo",
      description: "3 Bắp rang + 4 Nước ngọt + 1 Nachos",
    },
  ]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: ProductCategory) => {
    switch (category) {
      case "Thức Ăn":
        return (
          <Badge className="bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30">
            🍿 Thức Ăn
          </Badge>
        );
      case "Nước uống":
        return (
          <Badge className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30">
            🥤 Nước uống
          </Badge>
        );
      case "Combo":
        return (
          <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
            🎁 Combo
          </Badge>
        );
    }
  };

  const stats = {
    total: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    lowStock: products.filter((p) => p.stock < 50).length,
    categories: {
      food: products.filter((p) => p.category === "Thức Ăn").length,
      drink: products.filter((p) => p.category === "Nước uống").length,
      combo: products.filter((p) => p.category === "Combo").length,
    },
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        supplier: product.supplier,
        category: product.category,
        weight: product.category === "Thức Ăn" ? product.weight.toString() : "",
        flavor: product.category === "Thức Ăn" ? product.flavor : "",
        volume: product.category === "Nước uống" ? product.volume.toString() : "",
        hasGas: product.category === "Nước uống" ? product.hasGas : false,
        description: product.category === "Combo" ? product.description : "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        stock: "",
        supplier: "",
        category: "Thức Ăn",
        weight: "",
        flavor: "",
        volume: "",
        hasGas: false,
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = () => {
    // TODO: Save to database
    const baseData = {
      id: editingProduct?.id || `SP${String(products.length + 1).padStart(3, "0")}`,
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      supplier: formData.supplier,
      category: formData.category,
    };

    let newProduct: Product;

    if (formData.category === "Thức Ăn") {
      newProduct = {
        ...baseData,
        category: "Thức Ăn",
        weight: parseFloat(formData.weight),
        flavor: formData.flavor,
      } as FoodProduct;
    } else if (formData.category === "Nước uống") {
      newProduct = {
        ...baseData,
        category: "Nước uống",
        volume: parseFloat(formData.volume),
        hasGas: formData.hasGas,
      } as DrinkProduct;
    } else {
      newProduct = {
        ...baseData,
        category: "Combo",
        description: formData.description,
      } as ComboProduct;
    }

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
    } else {
      setProducts([...products, newProduct]);
    }

    handleCloseDialog();
  };

  const handleDeleteProduct = (id: string) => {
    // TODO: Delete from database
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const renderCategorySpecificInfo = (product: Product) => {
    if (product.category === "Thức Ăn") {
      return (
        <div className="text-sm space-y-1">
          <div style={{ color: "#9CA3AF" }}>
            Trọng lượng: <span style={{ color: "#E5E7EB" }}>{product.weight}g</span>
          </div>
          <div style={{ color: "#9CA3AF" }}>
            Hương vị: <span style={{ color: "#E5E7EB" }}>{product.flavor}</span>
          </div>
        </div>
      );
    } else if (product.category === "Nước uống") {
      return (
        <div className="text-sm space-y-1">
          <div style={{ color: "#9CA3AF" }}>
            Thể tích: <span style={{ color: "#E5E7EB" }}>{product.volume}ml</span>
          </div>
          <div style={{ color: "#9CA3AF" }}>
            Có gas: <span style={{ color: product.hasGas ? "#10B981" : "#EF4444" }}>
              {product.hasGas ? "Có" : "Không"}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-sm" style={{ color: "#9CA3AF" }}>
          {product.description}
        </div>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: "#E5E7EB" }}>
            Quản lý sản phẩm
          </h1>
          <p style={{ color: "#9CA3AF" }}>
            Quản lý thức ăn, nước uống và combo
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#8B5CF620" }}>
                <Package className="w-6 h-6" style={{ color: "#8B5CF6" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Tổng sản phẩm
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
                <ShoppingBag className="w-6 h-6" style={{ color: "#FFC107" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Giá trị kho
              </p>
              <p className="text-2xl" style={{ color: "#FFC107" }}>
                {(stats.totalValue / 1000000).toFixed(1)}tr
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#EF444420" }}>
                <Package className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                Sắp hết hàng
              </p>
              <p className="text-2xl" style={{ color: "#EF4444" }}>
                {stats.lowStock}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div>
              <p className="text-sm mb-3" style={{ color: "#9CA3AF" }}>
                Phân loại
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span style={{ color: "#E5E7EB" }}>🍿 Thức ăn:</span>
                  <span style={{ color: "#FFC107" }}>{stats.categories.food}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#E5E7EB" }}>🥤 Nước uống:</span>
                  <span style={{ color: "#3B82F6" }}>{stats.categories.drink}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#E5E7EB" }}>🎁 Combo:</span>
                  <span style={{ color: "#8B5CF6" }}>{stats.categories.combo}</span>
                </div>
              </div>
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
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={(value: ProductCategory | "all") => setFilterCategory(value)}
            >
              <SelectTrigger className="w-48 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                <SelectValue placeholder="Lọc theo phân loại" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                <SelectItem value="all" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  Tất cả
                </SelectItem>
                <SelectItem value="Thức Ăn" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  🍿 Thức Ăn
                </SelectItem>
                <SelectItem value="Nước uống" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  🥤 Nước uống
                </SelectItem>
                <SelectItem value="Combo" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                  🎁 Combo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-[#8B5CF6]/20">
        <CardHeader>
          <CardTitle style={{ color: "#E5E7EB" }}>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#8B5CF6]/20 hover:bg-transparent">
                <TableHead style={{ color: "#9CA3AF" }}>ID</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Tên sản phẩm</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Phân loại</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Đơn giá</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Tồn kho</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Nhà phân phối</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Thông tin bổ sung</TableHead>
                <TableHead style={{ color: "#9CA3AF" }}>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-[#8B5CF6]/20">
                  <TableCell style={{ color: "#8B5CF6" }}>{product.id}</TableCell>
                  <TableCell style={{ color: "#E5E7EB" }}>{product.name}</TableCell>
                  <TableCell>{getCategoryBadge(product.category)}</TableCell>
                  <TableCell style={{ color: "#FFC107" }}>
                    {product.price.toLocaleString("vi-VN")}₫
                  </TableCell>
                  <TableCell
                    style={{ color: product.stock < 50 ? "#EF4444" : "#10B981" }}
                  >
                    {product.stock}
                  </TableCell>
                  <TableCell style={{ color: "#9CA3AF" }}>{product.supplier}</TableCell>
                  <TableCell>{renderCategorySpecificInfo(product)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(product)}
                        className="hover:bg-[#8B5CF6]/20"
                      >
                        <Edit className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="hover:bg-[#EF4444]/20"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: "#EF4444" }} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8" style={{ color: "#9CA3AF" }}>
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: "#E5E7EB" }}>
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" style={{ color: "#E5E7EB" }}>
                  Tên sản phẩm
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" style={{ color: "#E5E7EB" }}>
                    Đơn giá (₫)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="stock" style={{ color: "#E5E7EB" }}>
                    Tồn kho
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supplier" style={{ color: "#E5E7EB" }}>
                  Nhà phân phối
                </Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                  placeholder="Nhập tên nhà phân phối"
                />
              </div>

              <div>
                <Label htmlFor="category" style={{ color: "#E5E7EB" }}>
                  Phân loại
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ProductCategory) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                    <SelectItem value="Thức Ăn" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                      🍿 Thức Ăn
                    </SelectItem>
                    <SelectItem value="Nước uống" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                      🥤 Nước uống
                    </SelectItem>
                    <SelectItem value="Combo" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                      🎁 Combo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Specific Fields */}
            <div
              className="p-4 rounded-lg border"
              style={{ backgroundColor: "#0F1629", borderColor: "#8B5CF6" }}
            >
              <h4 className="mb-4" style={{ color: "#FFC107" }}>
                Thông tin chi tiết - {formData.category}
              </h4>

              {formData.category === "Thức Ăn" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="weight" style={{ color: "#E5E7EB" }}>
                      Trọng lượng (gram)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="bg-[#1C253A] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flavor" style={{ color: "#E5E7EB" }}>
                      Hương vị
                    </Label>
                    <Input
                      id="flavor"
                      value={formData.flavor}
                      onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                      className="bg-[#1C253A] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                      placeholder="Nhập hương vị"
                    />
                  </div>
                </div>
              )}

              {formData.category === "Nước uống" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="volume" style={{ color: "#E5E7EB" }}>
                      Thể tích (ml)
                    </Label>
                    <Input
                      id="volume"
                      type="number"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="bg-[#1C253A] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hasGas" style={{ color: "#E5E7EB" }}>
                      Có gas
                    </Label>
                    <Select
                      value={formData.hasGas ? "true" : "false"}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, hasGas: value === "true" })
                      }
                    >
                      <SelectTrigger className="bg-[#1C253A] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                        <SelectItem value="true" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                          Có
                        </SelectItem>
                        <SelectItem value="false" className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20">
                          Không
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.category === "Combo" && (
                <div>
                  <Label htmlFor="description" style={{ color: "#E5E7EB" }}>
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#1C253A] border-[#8B5CF6]/30 focus:border-[#FFC107] mt-2 min-h-[100px]"
                    placeholder="Nhập mô tả combo"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveProduct}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
            >
              {editingProduct ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
