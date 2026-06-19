import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock, Trash2, Trophy } from 'lucide-react'

// Giả lập dữ liệu thành viên và số lần đổ rác
const leaderBoard = [
  { name: 'Lăng Trọng Tiến', count: 18, rating: 'Xuất Sắc', avatar: 'LTT', color: 'from-green-500 to-emerald-400' },
  { name: 'Nguyễn Hữu Đạt', count: 15, rating: 'Tích Cực', avatar: 'NHĐ', color: 'from-teal-500 to-emerald-400' },
  { name: 'Trần Thiên Tuệ', count: 14, rating: 'Chăm Chỉ', avatar: 'TTT', color: 'from-blue-500 to-indigo-400' },
  { name: 'Đàm Ngọc An', count: 12, rating: 'Đạt Yêu Cầu', avatar: 'ĐNA', color: 'from-sky-500 to-blue-400' },
  { name: 'Hồ Việt Hưng', count: 10, rating: 'Cần Cố Gắng', avatar: 'HVH', color: 'from-amber-500 to-orange-400' },
  { name: 'Lê Minh Hiếu', count: 8, rating: 'Lười Biếng', avatar: 'LMH', color: 'from-rose-500 to-red-400' },
]

const recentActivities = [
  { id: 1, name: 'Lê Minh Hiếu', time: 'Hôm qua, 22:30', status: 'Đã hoàn thành', type: 'Đầy sọt' },
  { id: 2, name: 'Trần Thiên Tuệ', time: '17/06/2026, 21:15', status: 'Đã hoàn thành', type: 'Rác hữu cơ' },
  { id: 3, name: 'Lăng Trọng Tiến', time: '15/06/2026, 08:30', status: 'Đã hoàn thành', type: 'Rác vô cơ' },
]

export default function GarbageStats() {
  const maxCount = Math.max(...leaderBoard.map((item) => item.count))

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5">
            <Trash2 className="h-8 w-8 text-rose-500 animate-bounce" />
            THỐNG KÊ ĐỔ RÁC
          </h1>
          <p className="text-muted-foreground mt-1">Ghi nhận chiến công dọn dẹp vệ sinh phòng 508.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 py-1.5 px-3 rounded-xl flex items-center gap-1">
            <AlertCircle className="h-4 w-4" /> Hôm nay: Lăng Trọng Tiến
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng Xếp Hạng Đổ Rác - Biểu Đồ Cột Trực Quan */}
        <Card className="lg:col-span-2 border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Bảng Vàng &quot;Dũng Sĩ Diệt Rác&quot;
            </CardTitle>
            <CardDescription>Số lần đổ rác ghi nhận trong tháng này.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {leaderBoard.map((item, index) => {
              const percentage = (item.count / maxCount) * 100
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        index === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' :
                        index === 1 ? 'bg-zinc-300 text-zinc-800' :
                        index === 2 ? 'bg-amber-700 text-white' : 'bg-neutral-200 dark:bg-neutral-800'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-semibold">{item.name}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {item.rating}
                      </Badge>
                    </div>
                    <span className="font-bold">{item.count} lần</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Hoạt động gần đây */}
        <div className="space-y-6">
          <Card className="border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" /> Nhật Ký Đổ Rác
              </CardTitle>
              <CardDescription>Các hoạt động gần nhất.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3 items-start border-b border-neutral-100 dark:border-neutral-800/50 pb-3 last:border-0 last:pb-0">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{act.name} <span className="font-normal text-muted-foreground">đã đổ</span> {act.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Banner Thách Thức */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-rose-500 to-orange-500 p-6 text-white shadow-lg space-y-3">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Trash2 className="h-32 w-32" />
            </div>
            <h3 className="text-lg font-bold">Thử thách tuần này</h3>
            <p className="text-sm text-white/90">
              Hoàn thành đổ rác sớm trước 21:00 hàng ngày để nhận Huy hiệu &quot;Vệ Sĩ Cần Mẫn&quot; kèm 1 lon nước ngọt từ quỹ phòng!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
