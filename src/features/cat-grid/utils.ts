import { Dispatch, SetStateAction } from 'react'
import { Images } from './types'

type UtilityFn = {
  id: string
  setImages: Dispatch<SetStateAction<Images>>
}

export const fetchImageFromApi = ({
  setImages,
  setIsLoading,
  setIsError,
}: {
  setImages: Dispatch<SetStateAction<Images>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setIsError: Dispatch<SetStateAction<boolean>>
}) => {
  setIsLoading(true)

  fetch(
    'https://api.thecatapi.com/v1/images/search?limit=1&mime_types=&order=Random&size=small&page=3&sub_id=demo-ce06ee'
  )
    .then((res) => res.json())
    .then((data: Images) => {
      setImages((prev) => {
        const updatedImages: Images = {
          [data[0].id]: { ...data[0], isLiked: false, tags: [] },
          ...prev,
        }

        localStorage.setItem('images', JSON.stringify(updatedImages))

        setIsLoading(false)

        return updatedImages
      })
    })
    .catch((err) => {
      setIsError(true)
      console.log(err)
    })
}

export const likeImage = ({ id, setImages }: UtilityFn) => {
  setImages((prev) => {
    const updatedImages = { ...prev }

    if (updatedImages[id]) {
      updatedImages[id] = {
        ...updatedImages[id],
        isLiked: !updatedImages[id].isLiked,
      }
    }

    localStorage.setItem('images', JSON.stringify(updatedImages))

    return updatedImages
  })
}

export const deleteImage = ({ id, setImages }: UtilityFn) => {
  setImages((prev) => {
    const updatedImages = { ...prev }

    if (updatedImages[id]) {
      delete updatedImages[id]
    }

    localStorage.setItem('images', JSON.stringify(updatedImages))

    return updatedImages
  })
}

export const addTag = ({
  tag,
  setTags,
}: {
  tag: string
  setTags: Dispatch<SetStateAction<string[]>>
}) => {
  setTags((prev) => {
    const updatedTags = !prev.includes(tag) ? [tag, ...prev] : prev

    localStorage.setItem('tags', JSON.stringify(updatedTags))

    return updatedTags
  })
}
