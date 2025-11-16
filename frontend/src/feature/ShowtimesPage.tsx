import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChevronRight,
  Film,
  MapPin,
  Clock,
  Armchair,
  Calendar,
  Plus, // Thêm
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button'; // Thêm
import { Input } from '../components/ui/input'; // Thêm
import { Label } from '../components/ui/label'; // Thêm
import {
  Dialog, // Thêm
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

interface Cinema {
  cinemaId: number;
  cinemaName: string;
}
interface Room {
  roomNo: string;
}
interface Showtime {
  showtimeId: number;
  startTime: string;
  movieName: string;
  status: 'DangMo' | 'DaDong' | 'DaHuy';
}
interface Movie {
  id: number; // Sửa lại: id (khớp với API /phim/list)
  name: string; // Sửa lại: name (khớp với API /phim/list)
}

export default function ShowtimesPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>('');
  const [selectedRoomNo, setSelectedRoomNo] = useState<string>('');

  const [cinemaList, setCinemaList] = useState<Cinema[]>([]);
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [loadingFormRooms, setLoadingFormRooms] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    MaPhim: '',
    MaPhong: '',
    MaRap: '',
    ThoiGianBatDau: '',
  });

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/suatchieu/rap');
        setCinemas(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách rạp:', error);
        alert('Lỗi! Không thể tải danh sách rạp. Đã đăng nhập chưa?');
      }
    };
    fetchCinemas();
  }, []);

  useEffect(() => {
    if (!selectedCinemaId) {
      setRooms([]);
      return;
    }
    const fetchRooms = async () => {
      setLoadingRooms(true);
      setShowtimes([]);
      setSelectedRoomNo('');
      try {
        const response = await axios.get(
          `http://localhost:5000/suatchieu/rap/${selectedCinemaId}/phongchieu/`
        );
        setRooms(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách phòng:', error);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [selectedCinemaId]);

  useEffect(() => {
    if (!selectedCinemaId || !selectedRoomNo) {
      setShowtimes([]);
      return;
    }

    fetchShowtimes();
  }, [selectedCinemaId, selectedRoomNo]);

  useEffect(() => {
    if (isAddDialogOpen) {
      const fetchCinemasForForm = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5000/suatchieu/rap'
          );
          setCinemaList(response.data);
        } catch (error) {
          console.error('Lỗi khi tải danh sách Rạp cho form:', error);
        }
      };

      const fetchMoviesForForm = async () => {
        try {
          const response = await axios.get('http://localhost:5000/phim/list');
          setMovieList(response.data);
        } catch (error) {
          console.error('Lỗi khi tải danh sách Phim cho form:', error);
        }
      };

      fetchCinemasForForm();
      fetchMoviesForForm();
      setRoomList([]);
      setFormData({
        MaPhim: '',
        MaPhong: '',
        MaRap: '',
        ThoiGianBatDau: '',
      });
    }
  }, [isAddDialogOpen]);

  useEffect(() => {
    if (!formData.MaRap) {
      setRoomList([]);
      return;
    }
    const fetchRoomsForForm = async () => {
      setLoadingFormRooms(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/suatchieu/rap/${formData.MaRap}/phongchieu/`
        );
        setRoomList(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách Phòng cho form:', error);
      } finally {
        setLoadingFormRooms(false);
      }
    };
    fetchRoomsForForm();
  }, [formData.MaRap]);
  const fetchShowtimes = async () => {
    setLoadingShowtimes(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/suatchieu/rap/${selectedCinemaId}/phongchieu/${selectedRoomNo}`
      );
      setShowtimes(response.data);
    } catch (error) {
      console.error('Lỗi khi tải suất chiếu:', error);
    } finally {
      setLoadingShowtimes(false);
    }
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/suatchieu/add', {
        ...formData,
      });

      alert('Thêm suất chiếu thành công!');
      setIsAddDialogOpen(false);
      if (
        formData.MaRap === selectedCinemaId &&
        formData.MaPhong === selectedRoomNo
      ) {
        fetchShowtimes();
      }
    } catch (error) {
      console.error('Lỗi khi thêm suất chiếu:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else {
        alert('Lỗi! Thêm suất chiếu thất bại.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DangMo':
        return (
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
            Đang mở
          </Badge>
        );
      case 'DaDong':
        return (
          <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">
            Đã đóng
          </Badge>
        );
      case 'DaHuy':
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (dateTimeString: string | Date) => {
    const date = new Date(dateTimeString);
    return (
      date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }) +
      ' - ' +
      date.toLocaleDateString('vi-VN')
    );
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#E5E7EB' }}>
            Suất chiếu
          </h1>
          <p style={{ color: '#9CA3AF' }}>
            Quản lý suất chiếu theo rạp và phòng
          </p>
        </div>

        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                <Select
                  value={selectedCinemaId}
                  onValueChange={(value) => {
                    setSelectedCinemaId(value);
                  }}
                >
                  <SelectTrigger className="w-48 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                    <SelectValue placeholder="Chọn rạp..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                    {cinemas.map((cinema) => (
                      <SelectItem
                        key={cinema.cinemaId}
                        value={cinema.cinemaId.toString()}
                        className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                      >
                        {cinema.cinemaName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCinemaId && (
                <>
                  <ChevronRight
                    className="w-5 h-5"
                    style={{ color: '#9CA3AF' }}
                  />
                  <div className="flex items-center gap-2">
                    <Armchair
                      className="w-5 h-5"
                      style={{ color: '#FFC107' }}
                    />
                    <Select
                      value={selectedRoomNo}
                      onValueChange={(value) => {
                        setSelectedRoomNo(value);
                      }}
                      disabled={loadingRooms}
                    >
                      <SelectTrigger className="w-56 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                        <SelectValue
                          placeholder={
                            loadingRooms ? 'Đang tải phòng...' : 'Chọn phòng...'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                        {rooms.map((room) => (
                          <SelectItem
                            key={room.roomNo}
                            value={room.roomNo}
                            className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                          >
                            {room.roomNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedRoomNo && (
                <>
                  <ChevronRight
                    className="w-5 h-5"
                    style={{ color: '#9CA3AF' }}
                  />
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" style={{ color: '#10B981' }} />
                    <span style={{ color: '#E5E7EB' }}>
                      {loadingShowtimes
                        ? 'Đang tải suất chiếu...'
                        : 'Danh sách suất chiếu'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedRoomNo && showtimes.length > 0 && (
          <Card className="border-[#8B5CF6]/20">
            <CardHeader>
              <CardTitle style={{ color: '#E5E7EB' }}>
                Các suất chiếu cho Phòng {selectedRoomNo}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {showtimes.map((showtime) => (
                <Card
                  key={showtime.showtimeId}
                  className="border-[#8B5CF6]/20 bg-[#1C253A]/50"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className="text-lg"
                        style={{ color: '#E5E7EB' }}
                      >
                        {showtime.movieName}
                      </CardTitle>
                      {getStatusBadge(showtime.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                      <span style={{ color: '#E5E7EB' }}>
                        {formatDateTime(showtime.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                      <span style={{ color: '#E5E7EB' }}>
                        ID Suất: {showtime.showtimeId}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {!selectedCinemaId && (
          <Card className="border-[#8B5CF6]/20">
            <CardContent className="p-12 text-center">
              <Calendar
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: '#8B5CF6' }}
              />
              <h3 className="text-xl mb-2" style={{ color: '#E5E7EB' }}>
                Chọn rạp để bắt đầu
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Vui lòng chọn rạp chiếu phim để xem danh sách phòng và suất
                chiếu
              </p>
            </CardContent>
          </Card>
        )}

        {selectedCinemaId && !selectedRoomNo && !loadingRooms && (
          <Card className="border-[#8B5CF6]/20">
            <CardContent className="p-12 text-center">
              <Armchair
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: '#FFC107' }}
              />
              <h3 className="text-xl mb-2" style={{ color: '#E5E7EB' }}>
                Chọn phòng
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Vui lòng chọn phòng để xem các suất chiếu
              </p>
            </CardContent>
          </Card>
        )}

        {selectedRoomNo && showtimes.length === 0 && !loadingShowtimes && (
          <Card className="border-[#8B5CF6]/20">
            <CardContent className="p-12 text-center">
              <Clock
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: '#10B981' }}
              />
              <h3 className="text-xl mb-2" style={{ color: '#E5E7EB' }}>
                Không có suất chiếu
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Hiện tại chưa có suất chiếu nào cho phòng này
              </p>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629] shadow-lg
                     rounded-full w-16 h-16
                     fixed bottom-8 right-8 z-50"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#1C253A] border-[#8B5CF6]/30">
          <DialogHeader>
            <DialogTitle style={{ color: '#E5E7EB' }}>
              Thêm suất chiếu mới
            </DialogTitle>
            <DialogDescription style={{ color: '#9CA3AF' }}>
              Điền thông tin để tạo suất chiếu mới
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="MaRap">Rạp chiếu</Label>
              <Select
                value={formData.MaRap}
                onValueChange={(value) => {
                  setFormData({ ...formData, MaRap: value, MaPhong: '' });
                }}
              >
                <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                  <SelectValue placeholder="Chọn rạp..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                  {cinemaList.map((cinema) => (
                    <SelectItem
                      key={cinema.cinemaId}
                      value={cinema.cinemaId.toString()}
                      className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                    >
                      {cinema.cinemaName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="MaPhong">Phòng chiếu</Label>
              <Select
                value={formData.MaPhong}
                onValueChange={(value) => {
                  setFormData({ ...formData, MaPhong: value });
                }}
                disabled={loadingFormRooms || !formData.MaRap}
              >
                <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                  <SelectValue
                    placeholder={
                      loadingFormRooms ? 'Đang tải phòng...' : 'Chọn phòng...'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                  {roomList.map((room) => (
                    <SelectItem
                      key={room.roomNo}
                      value={room.roomNo}
                      className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                    >
                      {room.roomNo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="MaPhim">Phim</Label>
              <Select
                value={formData.MaPhim}
                onValueChange={(value) => {
                  setFormData({ ...formData, MaPhim: value });
                }}
              >
                <SelectTrigger className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                  <SelectValue placeholder="Chọn phim..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                  {movieList.map((movie) => (
                    <SelectItem
                      key={movie.id}
                      value={movie.id.toString()}
                      className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                    >
                      {movie.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ThoiGianBatDau">Thời gian bắt đầu</Label>
              <Input
                id="ThoiGianBatDau"
                type="datetime-local"
                value={formData.ThoiGianBatDau}
                onChange={(e) =>
                  setFormData({ ...formData, ThoiGianBatDau: e.target.value })
                }
                required
                className="bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/10"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629]"
              >
                Thêm suất chiếu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
