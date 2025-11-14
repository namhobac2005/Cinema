import { useState } from "react";
import { ChevronRight, Film, MapPin, Clock, Armchair, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface Cinema {
  id: string;
  name: string;
}

interface Movie {
  id: string;
  name: string;
  cinemaId: string;
}

interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  startTime: string;
  endTime: string;
  room: string;
  status: "upcoming" | "ongoing" | "finished";
  seats: SeatStatus[][];
}

interface SeatStatus {
  row: string;
  col: number;
  status: "available" | "booked" | "processing";
}

export default function ShowtimesPage() {
  const cinemas: Cinema[] = [
    { id: "CIN001", name: "CGV Vincom" },
    { id: "CIN002", name: "Lotte Cinema" },
    { id: "CIN003", name: "Galaxy Cinema" },
  ];

  const movies: Movie[] = [
    { id: "MOV001", name: "Avengers: Endgame", cinemaId: "CIN001" },
    { id: "MOV002", name: "The Batman", cinemaId: "CIN001" },
    { id: "MOV003", name: "Spider-Man: No Way Home", cinemaId: "CIN002" },
    { id: "MOV004", name: "Dune: Part Two", cinemaId: "CIN002" },
    { id: "MOV005", name: "Oppenheimer", cinemaId: "CIN003" },
  ];

  const generateSeats = (availableSeats: number = 70): SeatStatus[][] => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const seats: SeatStatus[][] = [];
    let seatCount = 0;
    
    for (let i = 0; i < 10; i++) {
      const row: SeatStatus[] = [];
      for (let j = 1; j <= 10; j++) {
        seatCount++;
        let status: "available" | "booked" | "processing" = "available";
        
        if (seatCount > availableSeats) {
          status = Math.random() > 0.7 ? "processing" : "booked";
        }
        
        row.push({
          row: rows[i],
          col: j,
          status: status,
        });
      }
      seats.push(row);
    }
    return seats;
  };

  const showtimes: Showtime[] = [
    // CGV Vincom - Avengers: Endgame
    {
      id: "ST001",
      movieId: "MOV001",
      cinemaId: "CIN001",
      startTime: "08:15",
      endTime: "10:45",
      room: "Phòng 1",
      status: "finished",
      seats: generateSeats(15),
    },
    {
      id: "ST002",
      movieId: "MOV001",
      cinemaId: "CIN001",
      startTime: "10:30",
      endTime: "13:00",
      room: "Phòng 2",
      status: "finished",
      seats: generateSeats(25),
    },
    {
      id: "ST003",
      movieId: "MOV001",
      cinemaId: "CIN001",
      startTime: "14:25",
      endTime: "16:55",
      room: "Phòng 1",
      status: "ongoing",
      seats: generateSeats(62),
    },
    {
      id: "ST004",
      movieId: "MOV001",
      cinemaId: "CIN001",
      startTime: "18:45",
      endTime: "21:15",
      room: "Phòng 3",
      status: "upcoming",
      seats: generateSeats(88),
    },
    {
      id: "ST005",
      movieId: "MOV001",
      cinemaId: "CIN001",
      startTime: "21:30",
      endTime: "00:00",
      room: "Phòng 2",
      status: "upcoming",
      seats: generateSeats(95),
    },
    // CGV Vincom - The Batman
    {
      id: "ST006",
      movieId: "MOV002",
      cinemaId: "CIN001",
      startTime: "09:20",
      endTime: "11:50",
      room: "Phòng 4",
      status: "finished",
      seats: generateSeats(18),
    },
    {
      id: "ST007",
      movieId: "MOV002",
      cinemaId: "CIN001",
      startTime: "12:15",
      endTime: "14:45",
      room: "Phòng 1",
      status: "ongoing",
      seats: generateSeats(55),
    },
    {
      id: "ST008",
      movieId: "MOV002",
      cinemaId: "CIN001",
      startTime: "16:40",
      endTime: "19:10",
      room: "Phòng 4",
      status: "upcoming",
      seats: generateSeats(78),
    },
    {
      id: "ST009",
      movieId: "MOV002",
      cinemaId: "CIN001",
      startTime: "20:00",
      endTime: "22:30",
      room: "Phòng 2",
      status: "upcoming",
      seats: generateSeats(92),
    },
    // Lotte Cinema - Spider-Man: No Way Home
    {
      id: "ST010",
      movieId: "MOV003",
      cinemaId: "CIN002",
      startTime: "08:00",
      endTime: "10:30",
      room: "Phòng 1",
      status: "finished",
      seats: generateSeats(12),
    },
    {
      id: "ST011",
      movieId: "MOV003",
      cinemaId: "CIN002",
      startTime: "10:30",
      endTime: "13:00",
      room: "Phòng 2",
      status: "finished",
      seats: generateSeats(28),
    },
    {
      id: "ST012",
      movieId: "MOV003",
      cinemaId: "CIN002",
      startTime: "13:45",
      endTime: "16:15",
      room: "Phòng 1",
      status: "ongoing",
      seats: generateSeats(58),
    },
    {
      id: "ST013",
      movieId: "MOV003",
      cinemaId: "CIN002",
      startTime: "14:25",
      endTime: "16:55",
      room: "Phòng 3",
      status: "ongoing",
      seats: generateSeats(65),
    },
    {
      id: "ST014",
      movieId: "MOV003",
      cinemaId: "CIN002",
      startTime: "18:45",
      endTime: "21:15",
      room: "Phòng 2",
      status: "upcoming",
      seats: generateSeats(85),
    },
    {
      id: "ST015",
      movieId: "MOV003",
      cinemaId: "CIN002",
      startTime: "22:00",
      endTime: "00:30",
      room: "Phòng 1",
      status: "upcoming",
      seats: generateSeats(98),
    },
    // Lotte Cinema - Dune: Part Two
    {
      id: "ST016",
      movieId: "MOV004",
      cinemaId: "CIN002",
      startTime: "09:15",
      endTime: "11:45",
      room: "Phòng 4",
      status: "finished",
      seats: generateSeats(22),
    },
    {
      id: "ST017",
      movieId: "MOV004",
      cinemaId: "CIN002",
      startTime: "11:50",
      endTime: "14:20",
      room: "Phòng 3",
      status: "finished",
      seats: generateSeats(35),
    },
    {
      id: "ST018",
      movieId: "MOV004",
      cinemaId: "CIN002",
      startTime: "15:30",
      endTime: "18:00",
      room: "Phòng 4",
      status: "ongoing",
      seats: generateSeats(68),
    },
    {
      id: "ST019",
      movieId: "MOV004",
      cinemaId: "CIN002",
      startTime: "19:20",
      endTime: "21:50",
      room: "Phòng 3",
      status: "upcoming",
      seats: generateSeats(82),
    },
    // Galaxy Cinema - Oppenheimer
    {
      id: "ST020",
      movieId: "MOV005",
      cinemaId: "CIN003",
      startTime: "08:30",
      endTime: "11:00",
      room: "Phòng 1",
      status: "finished",
      seats: generateSeats(20),
    },
    {
      id: "ST021",
      movieId: "MOV005",
      cinemaId: "CIN003",
      startTime: "10:30",
      endTime: "13:00",
      room: "Phòng 2",
      status: "finished",
      seats: generateSeats(30),
    },
    {
      id: "ST022",
      movieId: "MOV005",
      cinemaId: "CIN003",
      startTime: "14:25",
      endTime: "16:55",
      room: "Phòng 1",
      status: "ongoing",
      seats: generateSeats(60),
    },
    {
      id: "ST023",
      movieId: "MOV005",
      cinemaId: "CIN003",
      startTime: "17:10",
      endTime: "19:40",
      room: "Phòng 3",
      status: "upcoming",
      seats: generateSeats(75),
    },
    {
      id: "ST024",
      movieId: "MOV005",
      cinemaId: "CIN003",
      startTime: "18:45",
      endTime: "21:15",
      room: "Phòng 2",
      status: "upcoming",
      seats: generateSeats(90),
    },
    {
      id: "ST025",
      movieId: "MOV005",
      cinemaId: "CIN003",
      startTime: "21:45",
      endTime: "00:15",
      room: "Phòng 1",
      status: "upcoming",
      seats: generateSeats(96),
    },
  ];

  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  const filteredMovies = selectedCinema
    ? movies.filter((m) => m.cinemaId === selectedCinema)
    : [];

  const filteredShowtimes = selectedMovie
    ? showtimes.filter((s) => s.movieId === selectedMovie && s.cinemaId === selectedCinema)
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
            Chưa chiếu
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            Đang chiếu
          </Badge>
        );
      case "finished":
        return (
          <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">
            Đã chiếu
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case "available":
        return "#6B7280"; // Gray
      case "booked":
        return "#10B981"; // Green
      case "processing":
        return "#FFC107"; // Yellow
      default:
        return "#6B7280";
    }
  };

  const getSeatStats = (seats: SeatStatus[][]) => {
    let available = 0;
    let booked = 0;
    let processing = 0;

    seats.forEach((row) => {
      row.forEach((seat) => {
        if (seat.status === "available") available++;
        else if (seat.status === "booked") booked++;
        else if (seat.status === "processing") processing++;
      });
    });

    return { available, booked, processing, total: 100 };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2" style={{ color: "#E5E7EB" }}>
          Suất chiếu
        </h1>
        <p style={{ color: "#9CA3AF" }}>
          Quản lý suất chiếu và sơ đồ ghế ngồi
        </p>
      </div>

      {/* Breadcrumb Navigation */}
      <Card className="border-[#8B5CF6]/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Cinema Selection */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: "#8B5CF6" }} />
              <Select
                value={selectedCinema}
                onValueChange={(value) => {
                  setSelectedCinema(value);
                  setSelectedMovie("");
                  setSelectedShowtime(null);
                }}
              >
                <SelectTrigger className="w-48 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                  <SelectValue placeholder="Chọn rạp..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                  {cinemas.map((cinema) => (
                    <SelectItem
                      key={cinema.id}
                      value={cinema.id}
                      className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                    >
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCinema && (
              <>
                <ChevronRight className="w-5 h-5" style={{ color: "#9CA3AF" }} />
                {/* Movie Selection */}
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5" style={{ color: "#FFC107" }} />
                  <Select
                    value={selectedMovie}
                    onValueChange={(value) => {
                      setSelectedMovie(value);
                      setSelectedShowtime(null);
                    }}
                  >
                    <SelectTrigger className="w-56 bg-[#0F1629] border-[#8B5CF6]/30 focus:border-[#FFC107]">
                      <SelectValue placeholder="Chọn phim..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C253A] border-[#8B5CF6]/30">
                      {filteredMovies.map((movie) => (
                        <SelectItem
                          key={movie.id}
                          value={movie.id}
                          className="text-[#E5E7EB] focus:bg-[#8B5CF6]/20"
                        >
                          {movie.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedMovie && (
              <>
                <ChevronRight className="w-5 h-5" style={{ color: "#9CA3AF" }} />
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: "#10B981" }} />
                  <span style={{ color: "#E5E7EB" }}>Suất chiếu</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Showtimes List */}
      {selectedMovie && filteredShowtimes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredShowtimes.map((showtime) => {
            const stats = getSeatStats(showtime.seats);
            return (
              <Card
                key={showtime.id}
                className={`border-[#8B5CF6]/20 cursor-pointer transition-all hover:border-[#FFC107]/50 ${
                  selectedShowtime?.id === showtime.id
                    ? "border-[#FFC107] ring-2 ring-[#FFC107]/20"
                    : ""
                }`}
                onClick={() => setSelectedShowtime(showtime)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg" style={{ color: "#E5E7EB" }}>
                      {showtime.id}
                    </CardTitle>
                    {getStatusBadge(showtime.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                    <span style={{ color: "#E5E7EB" }}>
                      {showtime.startTime} - {showtime.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                    <span style={{ color: "#E5E7EB" }}>{showtime.room}</span>
                  </div>
                  <div className="pt-2 border-t border-[#8B5CF6]/20">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span style={{ color: "#9CA3AF" }}>Ghế trống:</span>
                      <span style={{ color: "#10B981" }}>{stats.available}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span style={{ color: "#9CA3AF" }}>Đã đặt:</span>
                      <span style={{ color: "#6B7280" }}>{stats.booked}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#9CA3AF" }}>Đang xử lý:</span>
                      <span style={{ color: "#FFC107" }}>{stats.processing}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Seat Map */}
      {selectedShowtime && (
        <Card className="border-[#8B5CF6]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: "#E5E7EB" }}>
                Sơ đồ ghế - {selectedShowtime.id} ({selectedShowtime.room})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: "#6B7280" }}
                  />
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    Còn trống
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: "#10B981" }}
                  />
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    Đã đặt
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: "#FFC107" }}
                  />
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    Đang xử lý
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Screen */}
            <div className="mb-8">
              <div
                className="h-2 rounded-t-full mx-auto"
                style={{
                  width: "80%",
                  background: "linear-gradient(to bottom, #8B5CF6, transparent)",
                }}
              />
              <div className="text-center mt-2">
                <span className="text-sm" style={{ color: "#9CA3AF" }}>
                  MÀN HÌNH
                </span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="flex justify-center">
              <div className="inline-block">
                {/* Column Numbers */}
                <div className="flex items-center mb-2">
                  <div className="w-8" />
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div
                      key={num}
                      className="w-10 h-8 flex items-center justify-center text-sm"
                      style={{ color: "#9CA3AF" }}
                    >
                      {num}
                    </div>
                  ))}
                </div>

                {/* Seats with Row Letters */}
                {selectedShowtime.seats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center mb-2">
                    {/* Row Letter */}
                    <div
                      className="w-8 h-8 flex items-center justify-center text-sm"
                      style={{ color: "#9CA3AF" }}
                    >
                      {row[0].row}
                    </div>

                    {/* Seats */}
                    {row.map((seat, colIndex) => (
                      <button
                        key={`${seat.row}${seat.col}`}
                        className="w-10 h-8 m-0.5 rounded transition-all hover:opacity-80 flex items-center justify-center"
                        style={{
                          backgroundColor: getSeatColor(seat.status),
                        }}
                        title={`${seat.row}${seat.col} - ${
                          seat.status === "available"
                            ? "Còn trống"
                            : seat.status === "booked"
                            ? "Đã đặt"
                            : "Đang xử lý"
                        }`}
                      >
                        <Armchair className="w-4 h-4" style={{ color: "#0F1629" }} />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedCinema && (
        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: "#8B5CF6" }} />
            <h3 className="text-xl mb-2" style={{ color: "#E5E7EB" }}>
              Chọn rạp để bắt đầu
            </h3>
            <p style={{ color: "#9CA3AF" }}>
              Vui lòng chọn rạp chiếu phim để xem danh sách phim và suất chiếu
            </p>
          </CardContent>
        </Card>
      )}

      {selectedCinema && !selectedMovie && (
        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-12 text-center">
            <Film className="w-16 h-16 mx-auto mb-4" style={{ color: "#FFC107" }} />
            <h3 className="text-xl mb-2" style={{ color: "#E5E7EB" }}>
              Chọn phim
            </h3>
            <p style={{ color: "#9CA3AF" }}>
              Vui lòng chọn phim để xem các suất chiếu
            </p>
          </CardContent>
        </Card>
      )}

      {selectedMovie && filteredShowtimes.length === 0 && (
        <Card className="border-[#8B5CF6]/20">
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: "#10B981" }} />
            <h3 className="text-xl mb-2" style={{ color: "#E5E7EB" }}>
              Không có suất chiếu
            </h3>
            <p style={{ color: "#9CA3AF" }}>
              Hiện tại chưa có suất chiếu nào cho phim này
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
