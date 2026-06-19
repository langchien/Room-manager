'use client'

import { CustomTable } from '@/components/tables/custom-table'
import { memberColumns } from '@/components/tables/member.column'
import type { Member } from '@/types/member'

export function MembersTable({ members }: { members: Member[] }) {
  return <CustomTable data={members} columns={memberColumns} className='border shadow-md' />
}
