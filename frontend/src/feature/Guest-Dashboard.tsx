import { useState } from "react";
import { Film, ShoppingBag, Plus, Minus, Trash2, Mail, QrCode, CreditCard, X, ChevronLeft, MapPin, Clock, Globe, Calendar, Users, Play, Info, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import "./GuestCart.css"

interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
}

interface Movie {
  id: number;
  tenPhim: string;
  moTa: string;
  thoiLuong: number;
  xuatXu: string;
  dangPhim: string;
  ngayPhatHanh: string;
  trailerURL: string;
  posterURL: string;
  gioiHanTuoi: number;
}

interface Showtime {
  id: string;
  gioChieu: string;
  ngayChieu: string;
  phongChieu: string;
  dinhDangChieu: string;
  longTieng: boolean;
  phuDe: string;
  giaVe: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "ticket" | "product";
  details?: string;
}

type ViewMode = "theaters" | "movies" | "showtimes" | "products";

interface GuestDashboardProps {
  onBackToLogin?: () => void;
}

export default function GuestDashboard({ onBackToLogin }: GuestDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("theaters");
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Sample theaters
  const theaters: Theater[] = [
    { id: "T001", name: "CinemaHub Hà Nội", address: "123 Nguyễn Trãi, Thanh Xuân", city: "Hà Nội" },
    { id: "T002", name: "CinemaHub Sài Gòn", address: "456 Nguyễn Huệ, Quận 1", city: "TP. Hồ Chí Minh" },
    { id: "T003", name: "CinemaHub Đà Nẵng", address: "789 Trần Phú, Hải Châu", city: "Đà Nẵng" },
  ];

  // Sample movies (with full schema)
  const moviesData: Record<string, Movie[]> = {
    T001: [
      {
        id: 1,
        tenPhim: "Avatar: The Way of Water",
        moTa: "Bộ phim tiếp theo của Avatar, Jake Sully và Neytiri đã có gia đình và phải đối mặt với những mối đe dọa mới từ con người.",
        thoiLuong: 192,
        xuatXu: "Mỹ",
        dangPhim: "Hành động, Phiêu lưu, Khoa học viễn tưởng",
        ngayPhatHanh: "2022-12-16",
        trailerURL: "https://www.youtube.com/watch?v=d9MyW72ELq0",
        posterURL: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
        gioiHanTuoi: 13,
      },
      {
        id: 2,
        tenPhim: "Oppenheimer",
        moTa: "Câu chuyện về J. Robert Oppenheimer, nhà vật lý lý thuyết người đã dẫn dầu dự án Manhattan trong Thế chiến II.",
        thoiLuong: 180,
        xuatXu: "Mỹ, Anh",
        dangPhim: "Tiểu sử, Lịch sử, Drama",
        ngayPhatHanh: "2023-07-21",
        trailerURL: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        posterURL: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400",
        gioiHanTuoi: 16,
      },
            {
        id: 8,
        tenPhim: "Spider-Man: No Way Home",
        moTa: "Peter Parker tìm kiếm sự giúp đỡ từ Doctor Strange sau khi danh tính của cậu bị tiết lộ.",
        thoiLuong: 148,
        xuatXu: "Mỹ",
        dangPhim: "Hành động, Siêu anh hùng",
        ngayPhatHanh: "2021-12-17",
        trailerURL: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
        posterURL: "https://images.unsplash.com/photo-1635805737707-57588a5203dd?w=400",
        gioiHanTuoi: 13,
        },
        {
        id: 9,
        tenPhim: "Mission: Impossible – Dead Reckoning",
        moTa: "Ethan Hunt và nhóm IMF đối mặt với vũ khí AI nguy hiểm đe doạ thế giới.",
        thoiLuong: 163,
        xuatXu: "Mỹ",
        dangPhim: "Hành động, Gián điệp",
        ngayPhatHanh: "2023-07-12",
        trailerURL: "https://www.youtube.com/watch?v=avz06PDqDbM",
        posterURL: "https://images.unsplash.com/photo-1604908177522-4320e9f48976?w=400",
        gioiHanTuoi: 16,
        },
        {
        id: 10,
        tenPhim: "Elemental",
        moTa: "Câu chuyện về hai nguyên tố lửa và nước vượt qua khác biệt để làm bạn.",
        thoiLuong: 102,
        xuatXu: "Mỹ",
        dangPhim: "Hoạt hình, Gia đình",
        ngayPhatHanh: "2023-06-16",
        trailerURL: "https://www.youtube.com/watch?v=hXzcyx9V0xw",
        posterURL: "https://images.unsplash.com/photo-1686205302820-c958b2a08851?w=400",
        gioiHanTuoi: 3,
        }
    ],
    T002: [
      {
        id: 3,
        tenPhim: "Barbie",
        moTa: "Barbie và Ken tìm kiếm hạnh phúc thực sự sau khi được trải nghiệm thế giới thực.",
        thoiLuong: 114,
        xuatXu: "Mỹ",
        dangPhim: "Hài, Phiêu lưu, Fantasy",
        ngayPhatHanh: "2023-07-21",
        trailerURL: "https://www.youtube.com/watch?v=pBk4NYhWNMM",
        posterURL: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400",
        gioiHanTuoi: 13,
      },
    ],
    T003: [
      {
        id: 4,
        tenPhim: "Dune: Part Two",
        moTa: "Paul Atreides hợp nhất với Chani và người Fremen trong khi tìm cách trả thù những kẻ đã phá hủy gia đình ông.",
        thoiLuong: 166,
        xuatXu: "Mỹ, Canada",
        dangPhim: "Hành động, Phiêu lưu, Drama",
        ngayPhatHanh: "2024-03-01",
        trailerURL: "https://www.youtube.com/watch?v=Way9Dexny3w",
        posterURL: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
        gioiHanTuoi: 13,
      },
    ],
  };

  // Sample showtimes
  const showtimesData: Record<number, Showtime[]> = {
    1: [
      {
        id: "ST001",
        gioChieu: "10:00",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 1",
        dinhDangChieu: "2D",
        longTieng: false,
        phuDe: "Tiếng Việt",
        giaVe: 80000,
      },
      {
        id: "ST002",
        gioChieu: "14:30",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 2",
        dinhDangChieu: "3D",
        longTieng: false,
        phuDe: "Tiếng Việt",
        giaVe: 120000,
      },
      {
        id: "ST003",
        gioChieu: "19:00",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 3",
        dinhDangChieu: "IMAX",
        longTieng: false,
        phuDe: "Tiếng Việt",
        giaVe: 150000,
      },
      {
        id: "ST004",
        gioChieu: "21:30",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 1",
        dinhDangChieu: "2D",
        longTieng: true,
        phuDe: "Không",
        giaVe: 90000,
      },
    ],
    2: [
      {
        id: "ST005",
        gioChieu: "11:00",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 1",
        dinhDangChieu: "2D",
        longTieng: false,
        phuDe: "Tiếng Việt",
        giaVe: 85000,
      },
      {
        id: "ST006",
        gioChieu: "15:00",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 4",
        dinhDangChieu: "IMAX",
        longTieng: false,
        phuDe: "Tiếng Anh",
        giaVe: 160000,
      },
    ],
    3: [
      {
        id: "ST007",
        gioChieu: "13:00",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 2",
        dinhDangChieu: "2D",
        longTieng: false,
        phuDe: "Tiếng Việt",
        giaVe: 75000,
      },
    ],
    4: [
      {
        id: "ST008",
        gioChieu: "16:00",
        ngayChieu: "2025-11-25",
        phongChieu: "Phòng 3",
        dinhDangChieu: "IMAX",
        longTieng: false,
        phuDe: "Tiếng Việt",
        giaVe: 155000,
      },
    ],
  };

  // Sample products
  const products: Product[] = [
    { id: "SP001", name: "Bắp rang bơ", price: 45000, category: "Thức ăn" },
    { id: "SP002", name: "Bắp rang caramel", price: 50000, category: "Thức ăn" },
    { id: "SP003", name: "Hotdog", price: 35000, category: "Thức ăn" },
    { id: "SP004", name: "Coca Cola", price: 25000, category: "Nước uống" },
    { id: "SP005", name: "Pepsi", price: 25000, category: "Nước uống" },
    { id: "SP006", name: "Nước cam", price: 30000, category: "Nước uống" },
    { id: "SP007", name: "Combo Solo", price: 85000, category: "Combo" },
    { id: "SP008", name: "Combo Couple", price: 150000, category: "Combo" },
  ];

  const handleSelectTheater = (theater: Theater) => {
    setSelectedTheater(theater);
    setViewMode("movies");
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setViewMode("showtimes");
  };

  const handleSelectShowtime = (showtime: Showtime) => {
    if (!selectedMovie) return;

    const ticketName = `${selectedMovie.tenPhim} - ${showtime.gioChieu} ${showtime.ngayChieu}`;
    const ticketDetails = `${showtime.phongChieu} | ${showtime.dinhDangChieu} | ${showtime.longTieng ? "Lồng tiếng" : "Phụ đề " + showtime.phuDe}`;
    
    const existingTicket = cart.find((item) => item.id === showtime.id);

    if (existingTicket) {
      setCart(
        cart.map((item) =>
          item.id === showtime.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: showtime.id,
          name: ticketName,
          price: showtime.giaVe,
          quantity: 1,
          type: "ticket",
          details: ticketDetails,
        },
      ]);
    }

    // Auto-navigate to products
    setViewMode("products");
  };

  const addProductToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          type: "product",
        },
      ]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
      alert("Voucher áp dụng thành công! Giảm 10%");
    } else if (voucherCode.toUpperCase() === "SAVE50K") {
      setDiscount(50000);
      alert("Voucher áp dụng thành công! Giảm 50.000₫");
    } else {
      alert("Mã voucher không hợp lệ!");
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount < 100 ? (subtotal * discount) / 100 : discount;
  const total = Math.max(0, subtotal - discountAmount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePayment = () => {
    alert("Thanh toán thành công! Vé đã được gửi đến email của bạn.");
    setCart([]);
    setEmail("");
    setVoucherCode("");
    setDiscount(0);
    setIsPaymentOpen(false);
    setViewMode("theaters");
    setSelectedTheater(null);
    setSelectedMovie(null);
  };

  const handleBack = () => {
    if (viewMode === "products") {
      setViewMode("showtimes");
    } else if (viewMode === "showtimes") {
      setSelectedMovie(null);
      setViewMode("movies");
    } else if (viewMode === "movies") {
      setSelectedTheater(null);
      setViewMode("theaters");
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0F1629" }}>
      {/* Header */}
      <div className="border-b " style={{ backgroundColor: "#1C253A", borderColor: "rgba(139, 92, 246, 0.2)", height: "100px" }}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {viewMode !== "theaters" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="hover:bg-[#8B5CF6]/20"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: "#8B5CF6" }} />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Film className="w-8 h-8" style={{ color: "#8B5CF6" }} />
                <div className="absolute inset-0 blur-lg opacity-50" style={{ backgroundColor: "#8B5CF6" }} />
              </div>
              <div>
                <h1 className="text-xl" style={{ color: "#FFC107" }}>
                  CinemaHub
                </h1>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  {selectedTheater?.name || "Đặt vé trực tuyến"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {onBackToLogin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToLogin}
                className="hover:bg-[#8B5CF6]/20"
                style={{ color: "#E5E7EB" }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: "#8B5CF620" }}>
              <ShoppingBag className="w-5 h-5" style={{ color: "#8B5CF6" }} />
              <span style={{ color: "#E5E7EB" }}>{cart.length}</span>
            </div>
            <Button onClick={handleCheckout} className="bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629]">
              Thanh toán
            </Button>
          </div>
        </div>
      </div>




      {/* Content */}
      <div className="w-full px-6 py-8">
        <div className="dashboard-layout">
          {/* Main Content */}
          <div className="w-full">
            {/* Theater Selection */}
            {viewMode === "theaters" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6" style={{ color: "#8B5CF6" }} />
                  <h2 className="text-2xl" style={{ color: "#E5E7EB" }}>
                    Chọn rạp chiếu phim
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {theaters.map((theater) => (
                    <Card
                    key={theater.id}
                    className="border-[#8B5CF6]/20 hover:border-[#8B5CF6] transition-all relative"
                    >
                    <CardContent className="p-6">
                        
                        {/* Nút giống mẫu bạn gửi */}
                        <button
                        onClick={() => handleSelectTheater(theater)}
                        className="select-theater-btn"
                        >
                        Chọn rạp
                        </button>

                        <h3 className="text-xl mb-2" style={{ color: "#E5E7EB" }}>
                        {theater.name}
                        </h3>
                        <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                        📍 {theater.address}
                        </p>
                        <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                        {theater.city}
                        </Badge>

                    </CardContent>
                    </Card>

                  ))}
                </div>
              </div>
            )}

            {/* ==================== 🎬 MOVIE SELECTION ==================== */}
            {viewMode === "movies" && selectedTheater && (
            <div className="mt-10 w-full">
                <div className="flex items-center gap-3 mb-6">
                <Film className="w-6 h-6" style={{ color: "#8B5CF6" }} />
                <h2 className="text-2xl font-semibold" style={{ color: "#E5E7EB" }}>
                    Chọn phim
                </h2>
                </div>

                <div
                className="w-full grid gap-6 xl:gap-8 justify-items-center"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
                >
                {moviesData[selectedTheater.id]?.map((movie) => (
                    <Card
                    key={movie.id}
                    className="movie-card border-[#8B5CF6]/20 hover:border-[#8B5CF6] h-full"
                    >
                    {/* Poster */}
                    <div className="movie-thumb">
                        <ImageWithFallback
                        src={movie.posterURL}
                        alt={movie.tenPhim}
                        className="movie-thumb-img"
                        />
                    </div>

                    {/* ✅ flex-col để nút dính đáy */}
                    <CardContent className="p-3 flex flex-col h-full">
                        <h3 className="mb-2 text-lg font-medium" style={{ color: "#E5E7EB" }}>
                        {movie.tenPhim}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30">
                            {movie.gioiHanTuoi}+
                        </Badge>
                        <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                            {movie.thoiLuong} phút
                        </Badge>
                        </div>

                        {/* phần chữ chiếm phía trên */}
                        <p className="text-sm line-clamp-2 mb-3" style={{ color: "#9CA3AF" }}>
                        {movie.moTa}
                        </p>

                        {/* nút sẽ bị đẩy xuống đáy nhờ margin-top:auto */}
                        <button
                        onClick={() => handleSelectMovie(movie)}
                        className="movie-showtime-btn"
                        >
                        Xem suất chiếu
                        </button>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
            )}







            {/* Movie Details & Showtimes */}
            {viewMode === "showtimes" && selectedMovie && (
              <div className="space-y-6">
                {/* Movie Info */}
                <Card className="border-[#8B5CF6]/20 overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-1">
                      <ImageWithFallback
                        src={selectedMovie.posterURL}
                        alt={selectedMovie.tenPhim}
                        className="w-full rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h2 className="text-3xl mb-2" style={{ color: "#E5E7EB" }}>
                          {selectedMovie.tenPhim}
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30">
                            {selectedMovie.gioiHanTuoi}+
                          </Badge>
                          <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                            {selectedMovie.dangPhim}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5" style={{ color: "#8B5CF6" }} />
                          <span style={{ color: "#9CA3AF" }}>Thời lượng:</span>
                          <span style={{ color: "#E5E7EB" }}>{selectedMovie.thoiLuong} phút</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5" style={{ color: "#8B5CF6" }} />
                          <span style={{ color: "#9CA3AF" }}>Xuất xứ:</span>
                          <span style={{ color: "#E5E7EB" }}>{selectedMovie.xuatXu}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5" style={{ color: "#8B5CF6" }} />
                          <span style={{ color: "#9CA3AF" }}>Ngày phát hành:</span>
                          <span style={{ color: "#E5E7EB" }}>
                            {new Date(selectedMovie.ngayPhatHanh).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5" style={{ color: "#8B5CF6" }} />
                          <span style={{ color: "#9CA3AF" }}>Giới hạn tuổi:</span>
                          <span style={{ color: "#E5E7EB" }}>{selectedMovie.gioiHanTuoi}+ tuổi</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-5 h-5" style={{ color: "#8B5CF6" }} />
                          <span style={{ color: "#9CA3AF" }}>Mô tả:</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#E5E7EB" }}>
                          {selectedMovie.moTa}
                        </p>
                      </div>

                      {selectedMovie.trailerURL && (
                        <Button
                          variant="outline"
                          className="border-[#FFC107]/30 hover:bg-[#FFC107]/20"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            window.open(selectedMovie.trailerURL, "_blank");
                          }}

                        >
                          <Play className="w-4 h-4 mr-2" style={{ color: "#FFC107" }} />
                          Xem Trailer
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Showtimes */}
                <div>
                  <h3 className="text-xl mb-4" style={{ color: "#E5E7EB" }}>
                    Suất chiếu
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {showtimesData[selectedMovie.id]?.map((showtime) => (
                      <Card
                        key={showtime.id}
                        className="border-[#8B5CF6]/20 hover:border-[#8B5CF6] cursor-pointer transition-all"
                        onClick={() => handleSelectShowtime(showtime)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
                              <div>
                                <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                                  Giờ chiếu
                                </p>
                                <p style={{ color: "#FFC107" }}>
                                  {showtime.gioChieu}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                                  Ngày chiếu
                                </p>
                                <p style={{ color: "#E5E7EB" }}>
                                  {new Date(showtime.ngayChieu).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                                  Phòng
                                </p>
                                <p style={{ color: "#E5E7EB" }}>{showtime.phongChieu}</p>
                              </div>
                              <div>
                                <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                                  Định dạng
                                </p>
                                <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                                  {showtime.dinhDangChieu}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                                  {showtime.longTieng ? "Lồng tiếng" : "Phụ đề"}
                                </p>
                                <p style={{ color: "#E5E7EB" }}>
                                  {showtime.longTieng ? "Có" : showtime.phuDe}
                                </p>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                                Giá vé
                              </p>
                              <p className="text-xl mb-2" style={{ color: "#FFC107" }}>
                                {showtime.giaVe.toLocaleString("vi-VN")}₫
                              </p>
                              <Button
                                size="sm"
                                className="select-showtime-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectShowtime(showtime);
                                }}
                                >
                                <Plus className="w-4 h-4 mr-1" />
                                Chọn
                                </Button>

                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {viewMode === "products" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="w-6 h-6" style={{ color: "#FFC107" }} />
                  <h2 className="text-2xl" style={{ color: "#E5E7EB" }}>
                    Thêm thức ăn & đồ uống
                  </h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="border-[#8B5CF6]/20 w-full">
                      <CardContent className="p-4">
                        <Badge className="mb-2 bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]/30">
                          {product.category}
                        </Badge>
                        <h4 className="mb-2" style={{ color: "#E5E7EB" }}>
                          {product.name}
                        </h4>
                        <p className="mb-4" style={{ color: "#FFC107" }}>
                          {product.price.toLocaleString("vi-VN")}₫
                        </p>
                        <Button
                          onClick={() => addProductToCart(product)}
                          size="sm"
                          className="w-full bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629]"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Thêm
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="hidden lg:block cart-sidebar" style={{ maxWidth: "380px", width: "100%" }}>
            <Card className="border-[#8B5CF6]/20 sticky top-6">
              <CardHeader>
                <CardTitle style={{ color: "#E5E7EB" }}>Giỏ hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3" style={{ color: "#9CA3AF" }} />
                    <p style={{ color: "#9CA3AF" }}>Giỏ hàng trống</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "#0F1629" }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm mb-1" style={{ color: "#E5E7EB" }}>
                              {item.name}
                            </h4>
                            {item.details && (
                              <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>
                                {item.details}
                              </p>
                            )}
                            <p className="text-sm" style={{ color: "#FFC107" }}>
                              {item.price.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="hover:bg-[#EF4444]/20"
                          >
                            <Trash2 className="w-4 h-4" style={{ color: "#EF4444" }} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="px-3" style={{ color: "#E5E7EB" }}>
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Separator style={{ backgroundColor: "#8B5CF6" }} />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#9CA3AF" }}>Tạm tính:</span>
                        <span style={{ color: "#E5E7EB" }}>
                          {subtotal.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between">
                          <span style={{ color: "#10B981" }}>Giảm giá:</span>
                          <span style={{ color: "#10B981" }}>
                            -{discountAmount.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      )}
                      <div
                        className="flex items-center justify-between pt-2 border-t"
                        style={{ borderColor: "#8B5CF6" }}
                      >
                        <span style={{ color: "#E5E7EB" }}>Tổng cộng:</span>
                        <span className="text-xl" style={{ color: "#FFC107" }}>
                          {total.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629]"
                    >
                      Tiến hành thanh toán
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: "#E5E7EB" }}>Xác nhận đơn hàng</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmCheckout} className="space-y-6 py-4">
            <div>
              <h4 className="mb-3" style={{ color: "#FFC107" }}>
                Chi tiết đơn hàng
              </h4>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#0F1629" }}
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <p style={{ color: "#E5E7EB" }}>{item.name}</p>
                        {item.details && (
                          <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                            {item.details}
                          </p>
                        )}
                        <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                          {item.quantity} x {item.price.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                      <p style={{ color: "#FFC107" }}>
                        {(item.quantity * item.price).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator style={{ backgroundColor: "#8B5CF6" }} />

            <div>
              <Label htmlFor="email" style={{ color: "#E5E7EB" }}>
                Email nhận vé <span style={{ color: "#EF4444" }}>*</span>
              </Label>
              <div className="relative mt-2">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#9CA3AF" }}
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                   setEmail(e.target.value)
                  }
                  placeholder="email@example.com"
                  required
                  className="pl-10 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="voucher" style={{ color: "#E5E7EB" }}>
                Mã giảm giá (tùy chọn)
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="voucher"
                  value={voucherCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVoucherCode(e.target.value)
                  }
                  placeholder="Nhập mã voucher"
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                />
                <Button
                  type="button"
                  onClick={applyVoucher}
                  variant="outline"
                  className="border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
                >
                  Áp dụng
                </Button>
              </div>
              <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                Thử: SAVE10 hoặc SAVE50K
              </p>
            </div>

            <Separator style={{ backgroundColor: "#8B5CF6" }} />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span style={{ color: "#9CA3AF" }}>Tạm tính:</span>
                <span style={{ color: "#E5E7EB" }}>
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span style={{ color: "#10B981" }}>Giảm giá:</span>
                  <span style={{ color: "#10B981" }}>
                    -{discountAmount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}
              <div
                className="flex items-center justify-between pt-3 border-t"
                style={{ borderColor: "#8B5CF6" }}
              >
                <span className="text-lg" style={{ color: "#E5E7EB" }}>
                  Tổng thanh toán:
                </span>
                <span className="text-2xl" style={{ color: "#FFC107" }}>
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCheckoutOpen(false)}
              className="border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
            >
              Quay lại
            </Button>
            <Button
              onClick={handleConfirmCheckout}
              className="bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629]"
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment QR Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30 max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#E5E7EB" }}>Thanh toán</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center">
              <div
                className="p-8 rounded-xl mb-4"
                style={{ backgroundColor: "#0F1629", border: "2px solid #8B5CF6" }}
              >
                <QrCode className="w-48 h-48" style={{ color: "#8B5CF6" }} />
              </div>
              <p className="text-center mb-2" style={{ color: "#E5E7EB" }}>
                Quét mã QR để thanh toán
              </p>
              <p className="text-center text-sm" style={{ color: "#9CA3AF" }}>
                Hoặc chuyển khoản đến số tài khoản
              </p>
            </div>

            <div
              className="p-4 rounded-lg space-y-2"
              style={{ backgroundColor: "#0F1629", border: "1px solid #8B5CF6" }}
            >
              <div className="flex justify-between">
                <span style={{ color: "#9CA3AF" }}>Ngân hàng:</span>
                <span style={{ color: "#E5E7EB" }}>VCB - Vietcombank</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#9CA3AF" }}>Số tài khoản:</span>
                <span style={{ color: "#E5E7EB" }}>1234567890</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#9CA3AF" }}>Chủ tài khoản:</span>
                <span style={{ color: "#E5E7EB" }}>CINEMAHUB JSC</span>
              </div>
              <Separator style={{ backgroundColor: "#8B5CF6" }} />
              <div className="flex justify-between">
                <span style={{ color: "#9CA3AF" }}>Số tiền:</span>
                <span className="text-xl" style={{ color: "#FFC107" }}>
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "#FFC10710", borderLeft: "4px solid #FFC107" }}
            >
              <p className="text-sm" style={{ color: "#FFC107" }}>
                💡 Vé sẽ được gửi đến email <strong>{email}</strong> sau khi thanh toán thành công
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentOpen(false)}
              className="border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handlePayment} className="bg-[#10B981] hover:bg-[#10B981]/90">
              <CreditCard className="w-4 h-4 mr-2" />
              Đã thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
