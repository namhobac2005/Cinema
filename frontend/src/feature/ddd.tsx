{
  /* Seat Map */
}
{
  selectedShowtime && (
    <Card className="border-[#8B5CF6]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle style={{ color: '#E5E7EB' }}>
            Sơ đồ ghế - {selectedShowtime.id} ({selectedShowtime.room})
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: '#6B7280' }}
              />
              <span className="text-sm" style={{ color: '#9CA3AF' }}>
                Còn trống
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: '#10B981' }}
              />
              <span className="text-sm" style={{ color: '#9CA3AF' }}>
                Đã đặt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: '#FFC107' }}
              />
              <span className="text-sm" style={{ color: '#9CA3AF' }}>
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
              width: '80%',
              background: 'linear-gradient(to bottom, #8B5CF6, transparent)',
            }}
          />
          <div className="text-center mt-2">
            <span className="text-sm" style={{ color: '#9CA3AF' }}>
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
                  style={{ color: '#9CA3AF' }}
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
                  style={{ color: '#9CA3AF' }}
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
                      seat.status === 'available'
                        ? 'Còn trống'
                        : seat.status === 'booked'
                        ? 'Đã đặt'
                        : 'Đang xử lý'
                    }`}
                  >
                    <Armchair
                      className="w-4 h-4"
                      style={{ color: '#0F1629' }}
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
