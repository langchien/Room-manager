import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, BarChart2, Calendar, Droplet, RefreshCw } from 'lucide-react'

// Giả lập dữ liệu đổi nước
const waterRank = [
  { name: 'Nguyễn Minh Hiếu', count: 12, rating: 'Lực Sĩ Bê Nước', avatar: 'NMH', color: 'from-blue-500 to-sky-400' },
  { name: 'Lăng Trọng Tiến', count: 10, rating: 'Tích Cực', avatar: 'LTT', color: 'from-sky-500 to-cyan-400' },
  { name: 'Đỗ Anh Khôi', count: 8, rating: 'Chăm Chỉ', avatar: 'ĐAK', color: 'from-cyan-500 to-indigo-400' },
  { name: 'Lê Xuân Nam', count: 5, rating: 'Đạt Chỉ Tiêu', avatar: 'LXN', color: 'from-indigo-500 to-blue-400' },
  { name: 'Nguyễn Ngọc Trưởng', count: 2, rating: 'Trợ Thủ', avatar: 'NNT', color: 'from-teal-500 to-cyan-400' },
  { name: 'Nguyễn Văn Hùng', count: 1, rating: 'Cổ Vũ', avatar: 'NVH', color: 'from-emerald-500 to-teal-400' },
]

const recentWaterLogs = [
  { id: 1, name: 'Nguyễn Minh Hiếu', date: 'Hôm nay, 10:15', note: 'Bình nước 20L Lavie' },
  { id: 2, name: 'Lăng Trọng Tiến', date: '16/06/2026, 18:45', note: 'Bình nước 20L Lavie' },
  { id: 3, name: 'Đỗ Anh Khôi', date: '11/06/2026, 15:30', note: 'Bình nước 20L Lavie' },
]

export default function WaterStats() {
  const maxWater = Math.max(...waterRank.map((item) => item.count))

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5">
            <Droplet className="h-8 w-8 text-sky-500 animate-pulse" />
            THỐNG KÊ ĐỔ NƯỚC
          </h1>
          <p className="text-muted-foreground mt-1">Vinh danh những bờ vai gánh vác nguồn sống cho phòng 508.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20 py-1.5 px-3 rounded-xl flex items-center gap-1">
            <RefreshCw className="h-4 w-4 animate-spin-slow" /> Mức nước hiện tại: ~60%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng Xếp Hạng Đổi Nước - Biểu Đồ Cột Trực Quan */}
        <Card className="lg:col-span-2 border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-500" /> Bảng Phong Thần &quot;Kỳ Tài Gánh Nước&quot;
            </CardTitle>
            <CardDescription>Số lần vác bình nước 20L được ghi nhận.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {waterRank.map((item, index) => {
              const percentage = (item.count / maxWater) * 100
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        index === 0 ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' :
                        index === 1 ? 'bg-zinc-300 text-zinc-800' :
                        index === 2 ? 'bg-amber-700 text-white' : 'bg-neutral-200 dark:bg-neutral-800'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-semibold">{item.name}</span>
                      <Badge variant="outline" className="text-[10px] border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5 px-1.5 py-0">
                        {item.rating}
                      </Badge>
                    </div>
                    <span className="font-bold">{item.count} bình</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Lịch sử đổi nước */}
        <div className="space-y-6">
          <Card className="border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-500" /> Nhật Ký Bơm Nước
              </CardTitle>
              <CardDescription>Danh sách lần đổi gần đây.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentWaterLogs.map((log) => (
                <div key={log.id} className="flex gap-3 items-start border-b border-neutral-100 dark:border-neutral-800/50 pb-3 last:border-0 last:pb-0">
                  <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl mt-0.5">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{log.name} <span className="font-normal text-muted-foreground">đã bê lắp</span> {log.note}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {log.date}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Banner Thống kê tổng hợp */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-lg space-y-3">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <BarChart2 className="h-32 w-32" />
            </div>
            <h3 className="text-lg font-bold">Thống kê quý này</h3>
            <p className="text-sm text-white/90">
              Cả phòng đã tiêu thụ tổng cộng 38 bình nước (tương đương 760 Lít nước). Sức khỏe dồi dào, da dẻ hồng hào!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
