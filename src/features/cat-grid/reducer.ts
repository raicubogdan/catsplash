import { Dispatch, useReducer } from 'react'
import { Images } from './types'

export const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'SET_IMAGES':
      return { ...state, images: action.payload }
    case 'SET_TAGS':
      return { ...state, tags: action.payload }
    case 'SET_SELECTED_IMAGE_ID':
      return { ...state, selectedImageId: action.payload }
    case 'SET_IS_MODAL_VISIBLE':
      return { ...state, isModalVisible: action.payload }
    case 'SET_IS_ERROR':
      return { ...state, isError: action.payload }
    default:
      return state
  }
}

const initialState: StateType = {
  images: JSON.parse(localStorage.getItem('images') || '{}') as Images,
  tags: JSON.parse(localStorage.getItem('tags') || '[]') as string[],
  selectedImageId: '',
  isModalVisible: false,
  isError: false,
}

export const useStateManagement = (): {
  state: StateType
  dispatch: Dispatch<ActionType>
} => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}

export type ActionType = {
  type:
    | 'SET_IMAGES'
    | 'SET_TAGS'
    | 'SET_SELECTED_IMAGE_ID'
    | 'SET_IS_MODAL_VISIBLE'
    | 'SET_IS_ERROR'
  payload: any
}

type StateType = {
  images: Images
  tags: string[]
  selectedImageId: string
  isModalVisible: boolean
  isError: boolean
}
