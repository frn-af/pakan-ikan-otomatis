
export type Schedule = {
  id: number
  datetime: string
  weight: number
  status: string | null
}

export const schedule: Schedule[] = [
  {
    id: 1,
    datetime: "2021-10-10T08:00:00",
    weight: 100,
    status: "done",

  },
  {
    id: 2,
    datetime: "2021-10-10T12:00:00",
    weight: 70,
    status: "waiting",
  },
  {
    id: 2,
    datetime: "2021-10-10T12:00:00",
    weight: 70,
    status: "error",
  },
]
