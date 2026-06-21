export enum TransationType {
  GARBAGE = 'GARBAGE',
  WATER = 'WATER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Member {
  id: number
  numberOrder: number
  studentID: string
  fullName: string
  major: string
  class: string
  phoneNumber: string
  homeTown: string
  address: string
  birthDate: string
  cccd: string | null
}
