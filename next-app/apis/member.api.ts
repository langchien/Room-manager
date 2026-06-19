import { Member } from '@/types/member'

export const memberApi = {
  getListMember: async () => {
    const response = await fetch(
      'https://raw.githubusercontent.com/langchien/Room-manager/refs/heads/main/data/members.json',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    const data = await response.json()
    return data as Member[]
  },
}
