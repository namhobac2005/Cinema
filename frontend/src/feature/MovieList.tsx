import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Film,
  Clapperboard,
  CalendarCheck,
  Archive,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

import { Textarea } from '../components/ui/textarea';

interface Movie {
  id: number;
  name: string;
  description: string;
  duration: number;
  origin: string;
  type: string;
  subtitles: string;
  dubbing: string;
  releaseDate: Date;
  status: string;
  TrailerURl: string;
  PosterURL: string;
  AgeLimit: number;
}

export default function MoviesList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    origin: '',
    type: '',
    subtitles: '',
    dubbing: '',
    releaseDate: '', // Sẽ có dạng 'YYYY-MM-DD' từ input type="date"
    status: '',
    TrailerURl: '',
    PosterURL: '',
    AgeLimit: '',
  });
  const stats = [
    {
      title: 'Tổng số phim',
      value: movies.length.toString(),
      icon: Film,
      color: '#FFC107',
    },
    {
      title: 'Đang chiếu',
      value: movies.filter((m) => m.status === 'DangChieu').length.toString(),
      icon: Clapperboard,
      color: '#10B981',
    },
    {
      title: 'Sắp chiếu',
      value: movies.filter((m) => m.status === 'SapChieu').length.toString(),
      icon: Clapperboard,
      color: '#159cd5ff',
    },
    {
      title: 'Ngừng chiếu',
      value: movies.filter((m) => m.status === 'NgungChieu').length.toString(),
      icon: Clapperboard,
      color: '#495954ff',
    },
  ];
  //xem danh sách phim
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Movie[]>(
        'http://localhost:5000/phim/all'
      );
      console.log('Dữ liệu từ API:', response.data);
      setMovies(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phim:', error);
      alert('Lỗi khi tải dữ liệu! Bạn đã đăng nhập ở trang Login chưa?');
    } finally {
      setLoading(false);
    }
  };

  // thêm phim mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMovie) {
      try {
        await axios.put(
          `http://localhost:5000/phim/update/${editingMovie.id}`,
          formData
        );
        fetchMovies();
        resetForm();
      } catch (error) {
        console.error('Lỗi khi cập nhật phim:', error);
        alert('Lỗi khi cập nhật phim! Vui lòng kiểm tra lại dữ liệu.');
      }
    } else {
      try {
        await axios.post('http://localhost:5000/phim/add', formData);
        fetchMovies();
        resetForm();
      } catch (error) {
        console.error('Lỗi khi thêm phim:', error);
        alert('Lỗi khi thêm phim! Vui lòng kiểm tra lại dữ liệu.');
      }
    }
  };
  // sửa phim gọi lại submit
  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      name: movie.name,
      description: movie.description,
      duration: movie.duration.toString(),
      origin: movie.origin,
      type: movie.type,
      subtitles: movie.subtitles,
      dubbing: movie.dubbing,
      releaseDate: movie.releaseDate
        ? new Date(movie.releaseDate).toISOString().split('T')[0]
        : '',
      status: movie.status,
      TrailerURl: movie.TrailerURl,
      PosterURL: movie.PosterURL,
      AgeLimit: movie.AgeLimit.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      try {
        await axios.delete(`http://localhost:5000/phim/delete/${id}`);
        fetchMovies();
      } catch (error) {
        console.error('Lỗi khi xóa phim:', error);
        alert('Lỗi khi xóa phim! Vui lòng thử lại.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      origin: '',
      type: '',
      subtitles: '',
      dubbing: '',
      releaseDate: '',
      status: '',
      TrailerURl: '',
      PosterURL: '',
      AgeLimit: '',
    });
    setEditingMovie(null);
    setIsDialogOpen(false);
  };
  useEffect(() => {
    fetchMovies();
  }, []);
  const filteredMovies = movies.filter(
    (m) =>
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DangChieu':
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            Đang chiếu
          </Badge>
        );
      case 'SapChieu':
        return (
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
            Sắp chiếu
          </Badge>
        );
      case 'NgungChieu':
        return (
          <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">
            Ngừng chiếu
          </Badge>
        );
      default:
        return null;
    }
  };
  // --- JSX (Giao diện) ---
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#E5E7EB' }}>
            Quản lý Phim
          </h1>
          <p style={{ color: '#9CA3AF' }}>
            Quản lý danh sách phim và thông tin chi tiết
          </p>
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
              Thêm phim mới
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle style={{ color: '#E5E7EB' }}>
                {editingMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
              </DialogTitle>
              <DialogDescription style={{ color: '#9CA3AF' }}>
                {editingMovie
                  ? 'Cập nhật thông tin chi tiết của phim'
                  : 'Tạo phim mới trong hệ thống'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên phim</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Dune: Part Two"
                  required
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nội dung tóm tắt của phim..."
                  className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="PosterURL">Link Poster</Label>
                  <Input
                    id="PosterURL"
                    value={formData.PosterURL}
                    onChange={(e) =>
                      setFormData({ ...formData, PosterURL: e.target.value })
                    }
                    placeholder="https://.../poster.jpg"
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="TrailerURl">Link Trailer (YouTube)</Label>
                  <Input
                    id="TrailerURl"
                    value={formData.TrailerURl}
                    onChange={(e) =>
                      setFormData({ ...formData, TrailerURl: e.target.value })
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="120"
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="AgeLimit">Giới hạn tuổi</Label>
                  <Input
                    id="AgeLimit"
                    type="number"
                    min="0"
                    value={formData.AgeLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, AgeLimit: e.target.value })
                    }
                    placeholder="16"
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Thể loại</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    placeholder="VD: Sci-fi, Adventure"
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Xuất xứ</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                    placeholder="VD: Mỹ, Nhật Bản"
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subtitles">Phụ đề</Label>
                  <Input
                    id="subtitles"
                    value={formData.subtitles}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitles: e.target.value })
                    }
                    placeholder="VD: Tiếng Việt"
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dubbing">Lồng tiếng</Label>
                  <Input
                    id="dubbing"
                    value={formData.dubbing}
                    onChange={(e) =>
                      setFormData({ ...formData, dubbing: e.target.value })
                    }
                    placeholder="VD: Tiếng Việt (hoặc Không)"
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Ngày phát hành</Label>
                  <Input
                    id="releaseDate"
                    type="date" // Dùng type="date" cho Date object
                    value={formData.releaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, releaseDate: e.target.value })
                    }
                    required
                    className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                      <SelectItem
                        value="DangChieu"
                        className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                      >
                        Đang chiếu
                      </SelectItem>
                      <SelectItem
                        value="SapChieu"
                        className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                      >
                        Sắp chiếu
                      </SelectItem>
                      <SelectItem
                        value="NgungChieu"
                        className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                      >
                        Ngừng chiếu
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  //variant="outline"
                  onClick={resetForm}
                  className="flex-1 border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/10"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629]"
                >
                  {editingMovie ? 'Cập nhật' : 'Thêm phim'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                  <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>
                    {stat.title}
                  </p>
                  <p className="text-2xl" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-[#8B5CF6]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#E5E7EB' }}>Danh sách phim</CardTitle>
            <div className="relative w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#9CA3AF' }}
              />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm phim..."
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
                <TableHead style={{ color: '#9CA3AF' }}>Tên phim</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Thể loại</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Thời lượng</TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>
                  Ngày phát hành
                </TableHead>
                <TableHead style={{ color: '#9CA3AF' }}>Trạng thái</TableHead>
                <TableHead className="text-right" style={{ color: '#9CA3AF' }}>
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow key={movie.id} className="border-[#8B5CF6]/20">
                  <TableCell style={{ color: '#8B5CF6' }}>{movie.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" style={{ color: '#FFC107' }} />
                      <span style={{ color: '#E5E7EB' }}>{movie.name}</span>
                    </div>
                  </TableCell>
                  <TableCell style={{ color: '#E5E7EB' }}>
                    {movie.type}
                  </TableCell>
                  <TableCell style={{ color: '#E5E7EB' }}>
                    {movie.duration} phút
                  </TableCell>
                  <TableCell style={{ color: '#9CA3AF' }}>
                    {movie.releaseDate
                      ? new Date(movie.releaseDate).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(movie.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="p-2 rounded-lg transition-all hover:bg-[#8B5CF6]/20"
                        style={{ color: '#8B5CF6' }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
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
          {filteredMovies.length === 0 && (
            <div className="text-center py-8" style={{ color: '#9CA3AF' }}>
              Không tìm thấy phim nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
