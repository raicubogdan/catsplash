import { Dispatch, SetStateAction } from 'react'
import { Images } from './types'
import { ActionType, StateType } from './reducer/types'

type ImageState = {
  id: string
  dispatch: Dispatch<ActionType>
  state: StateType
}

export const fetchImageFromApi = ({
  dispatch,
  setIsLoading,
}: {
  dispatch: Dispatch<ActionType>
  setIsLoading: Dispatch<SetStateAction<boolean>>
}) => {
  setIsLoading(true)

  fetch(
    'https://api.thecatapi.com/v1/images/search?limit=1&mime_types=&order=Random&size=small&page=3&sub_id=demo-ce06ee'
  )
    .then((res) => res.json())
    .then((data: Images) => {
      const storageImages = JSON.parse(
        localStorage.getItem('state') || '{}'
      ).images

      const updatedImages: Images = {
        [data[0].id]: { ...data[0], isLiked: false, tags: [] },
        ...storageImages,
      }

      setIsLoading(false)

      dispatch({
        type: 'SET_IMAGES',
        payload: { storageImages: updatedImages, stateImages: updatedImages },
      })
    })
    .catch((err) => {
      dispatch({
        type: 'SET_IS_ERROR',
        payload: err,
      })

      setIsLoading(false)
    })
}

export const likeImage = ({ id, dispatch, state }: ImageState) => {
  const storageImages: Images = JSON.parse(
    localStorage.getItem('state') || '{}'
  ).images

  if (storageImages[id]) {
    storageImages[id] = {
      ...storageImages[id],
      isLiked: !storageImages[id].isLiked,
    }
  }

  localStorage.setItem(
    'images',
    JSON.stringify({ ...storageImages, [id]: storageImages[id] })
  )

  dispatch({
    type: 'SET_IMAGES',
    payload: {
      storageImages: storageImages,
      stateImages: { ...state.images, [id]: storageImages[id] },
    },
  })
}

export const deleteImage = ({ id, dispatch, state }: ImageState) => {
  const storageImages: Images = JSON.parse(
    localStorage.getItem('state') || '{}'
  ).images

  const updatedImages = { ...state.images }

  if (storageImages[id]) {
    delete storageImages[id]
    delete updatedImages[id]
  }

  dispatch({
    type: 'SET_IMAGES',
    payload: { storageImages: storageImages, stateImages: updatedImages },
  })
}
