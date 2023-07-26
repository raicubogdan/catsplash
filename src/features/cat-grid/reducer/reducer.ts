import { Dispatch, createContext } from 'react'
import { Images } from '../types'
import { ActionType, StateType } from './types'

export const reducer = (state: StateType, action: ActionType) => {
  let newState = { ...state }

  switch (action.type) {
    case 'SET_IMAGES':
      newState = { ...state, images: action.payload.stateImages || {} }
      break
    case 'SET_TAGS':
      newState = { ...state, tags: action.payload || [] }
      break
    case 'SET_SELECTED_IMAGE_ID':
      newState = { ...state, selectedImageId: action.payload }
      break
    case 'SET_IS_MODAL_VISIBLE':
      newState = { ...state, isModalVisible: action.payload }
      break
    case 'SET_IS_ERROR':
      newState = { ...state, isError: action.payload }
      break
    default:
      break
  }

  if (action.type !== 'SET_IMAGES') {
    return newState
  }

  localStorage.setItem(
    'state',
    JSON.stringify({ ...newState, images: action.payload.storageImages })
  )

  return newState
}

export const initialState: StateType = {
  images: (JSON.parse(localStorage.getItem('state') || '{}').images ||
    {}) as Images,
  tags: (JSON.parse(localStorage.getItem('state') || '[]').tags ||
    []) as string[],
  selectedImageId: '',
  isModalVisible: false,
  isError: false,
}

export const Context = createContext<{
  state: StateType
  dispatch: Dispatch<ActionType>
}>({
  state: initialState,
  dispatch: () => null,
})
