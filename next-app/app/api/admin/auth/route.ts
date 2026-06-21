import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mật khẩu!' },
        { status: 400 },
      )
    }

    let adminConfig = await prisma.adminConfig.findUnique({
      where: { key: 'admin_password' },
    })

    if (!adminConfig) {
      // Khởi tạo mật khẩu mặc định nếu chưa có
      adminConfig = await prisma.adminConfig.create({
        data: {
          key: 'admin_password',
          value: 'admin123',
        },
      })
    }

    if (adminConfig.value === password) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu không chính xác!' },
        { status: 401 },
      )
    }
  } catch (error: any) {
    console.error('Lỗi khi xác thực mật khẩu:', error)
    return NextResponse.json({ success: false, error: 'Đã xảy ra lỗi hệ thống!' }, { status: 500 })
  }
}
