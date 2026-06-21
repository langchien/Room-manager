import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TransactionStatus } from '@/generated/prisma/client'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const isCompleted = data.status === TransactionStatus.COMPLETED

    const tx = await prisma.roomTransaction.create({
      data: {
        memberId: Number(data.memberId),
        type: data.type,
        status: data.status,
        scheduledAt: new Date(data.scheduledAt),
        completedAt: isCompleted ? new Date() : null,
        note: data.note || null,
      },
    })
    return NextResponse.json({ success: true, data: tx })
  } catch (error: any) {
    console.error('Lỗi khi tạo giao dịch trực nhật:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể ghi nhận hoặc lên lịch. Vui lòng thử lại!' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, note } = await request.json()
    const isCompleted = status === TransactionStatus.COMPLETED

    const updateData: any = {
      status,
      completedAt: isCompleted ? new Date() : null,
    }
    if (note !== undefined) {
      updateData.note = note
    }

    const tx = await prisma.roomTransaction.update({
      where: { id: Number(id) },
      data: updateData,
    })
    return NextResponse.json({ success: true, data: tx })
  } catch (error: any) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật trạng thái. Vui lòng thử lại!' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID giao dịch!' }, { status: 400 })
    }

    await prisma.roomTransaction.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Lỗi khi xóa giao dịch:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xóa bản ghi. Vui lòng thử lại!' },
      { status: 500 },
    )
  }
}
