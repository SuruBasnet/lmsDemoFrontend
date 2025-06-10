export type StudentInfo = {
  id: number
  name: string
  email: string
  plan: string
  status: string
  session: string
}

export type StudentCreate = {
  name: string
  email: string
  plan: string
  status: string
  session?: string
}

export type User = {
  id: number
  username: string
  profile: File
  email: string
}

