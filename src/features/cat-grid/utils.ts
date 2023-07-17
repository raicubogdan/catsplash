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

  console.log('fetching from api')

  fetch(
    'https://api.thecatapi.com/v1/images/search?limit=1&mime_types=&order=Random&size=small&page=3&sub_id=demo-ce06ee'
  )
    .then((res) => res.json())
    .then((data: Images) => {
      setImages(() => {
        const parsed = JSON.parse(localStorage.getItem('images') || '{}')

        const updatedImages: Images = {
          [data[0].id]: { ...data[0], isLiked: false, tags: [] },
          ...parsed,
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
  const storageItems: Images = JSON.parse(localStorage.getItem('images') || '{}')

  setImages((prev) => {
    const updatedImages = { ...prev }

    if (updatedImages[id]) {
      updatedImages[id] = {
        ...updatedImages[id],
        isLiked: !updatedImages[id].isLiked,
      }
    }

    console.log('updatedImages[id]', updatedImages[id])

    localStorage.setItem(
      'images',
      JSON.stringify({ ...storageItems, [id]: updatedImages[id] })
    )

    return updatedImages
  })
}

export const deleteImage = ({ id, setImages }: UtilityFn) => {
  const storageItems: Images = JSON.parse(localStorage.getItem('images') || '{}')

  setImages((prev) => {
    const updatedImages = { ...prev }

    if (updatedImages[id]) {
      delete updatedImages[id]
      delete storageItems[id]
    }

    if (!Object.values(storageItems).length) {
      localStorage.removeItem('images')
    } else {
      localStorage.setItem('images', JSON.stringify(storageItems))
    }

    return updatedImages
  })
}
