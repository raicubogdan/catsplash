import { Images } from '../types'

type SetImagesAction = {
  type: 'SET_IMAGES'
  payload: {
    storageImages: Images
    stateImages: Images
  }
}

type SetTagsAction = {
  type: 'SET_TAGS'
  payload: string[]
}

type SetSelectedImageIdAction = {
  type: 'SET_SELECTED_IMAGE_ID'
  payload: string
}

type SetIsModalVisibleAction = {
  type: 'SET_IS_MODAL_VISIBLE'
  payload: boolean
}

type SetIsErrorAction = {
  type: 'SET_IS_ERROR'
  payload: boolean
}

export type ActionType =
  | SetImagesAction
  | SetTagsAction
  | SetSelectedImageIdAction
  | SetIsModalVisibleAction
  | SetIsErrorAction

export type StateType = {
  images: Images
  tags: string[]
  selectedImageId: string
  isModalVisible: boolean
  isError: boolean
}
