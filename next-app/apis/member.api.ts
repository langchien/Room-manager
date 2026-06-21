import { Member } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export const memberApi = {
  getListMember: async (): Promise<Member[]> => {
    return prisma.member.findMany({
      orderBy: {
        numberOrder: 'asc',
      },
    })
  },
}
