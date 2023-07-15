export type Image = {
  id: string
  url: string
  width: number
  height: number
  isLiked: boolean
  tags: string[]
}

export type Images = Record<string, Image>
