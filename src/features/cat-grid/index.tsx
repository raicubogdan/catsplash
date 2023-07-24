import { useState, useRef, RefObject, ChangeEvent } from 'react'
import { Image, Images } from './types'
import { fetchImageFromApi } from './utils'
import { FaLongArrowAltUp, FaPaw } from 'react-icons/fa'
import { Modal } from '../../components/Modal'
import { Tags } from '../../components/Tags'
import { Card } from '../../components/Card'
import { useStateManagement } from './reducer'

export const CatGrid = () => {
  // TODO: create separate branch for redux
  // TODO: create separate branch for mobx

  const { state } = useStateManagement()

  const stateImagesArray: Image[] = Object.values(state.images)

  const filterSelectRef = useRef<HTMLSelectElement>(null)

  const storageImages: Image[] = Object.values(
    JSON.parse(localStorage.getItem('images') || '{}')
  )

  return (
    <div className="max-w-[1200px] w-full flex flex-col gap-4 items-center">
      {state.isError ? (
        <div className="text-red-700">
          Something went wrong! Contact the cat god for guidance
        </div>
      ) : null}

      <CatGridButtons filterSelectRef={filterSelectRef} />

      {stateImagesArray.length ? (
        <div className="flex-grow w-full h-full py-4 columns-1 md:columns-2 lg:columns-3">
          {stateImagesArray.map((image: Image) => (
            <Card key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <NoResultsFallback storageImages={storageImages} />
      )}

      {state.selectedImageId && (
        <Modal isVisible={state.isModalVisible}>
          <Tags />
        </Modal>
      )}
    </div>
  )
}

const CatGridButtons = ({
  filterSelectRef,
}: {
  filterSelectRef: RefObject<HTMLSelectElement>
}) => {
  const { state, dispatch } = useStateManagement()

  const [isLoading, setIsLoading] = useState(false)

  const handleFilterLikedImages = () => {
    const storageImages: Image[] = Object.values(
      JSON.parse(localStorage.getItem('images') || '{}')
    )

    const filteredArray = storageImages.filter((image: Image) => image.isLiked)

    if (filterSelectRef.current) {
      filterSelectRef.current.value = 'filter by tag'
    }

    const updatedImages = filteredArray.reduce((acc, image) => {
      acc[image.id] = image
      return acc
    }, {} as Images)

    dispatch({ type: 'SET_IMAGES', payload: updatedImages })
  }

  const handleFilterAllImages = () => {
    dispatch({
      type: 'SET_IMAGES',
      payload: JSON.parse(localStorage.getItem('images') || '{}'),
    })

    if (filterSelectRef.current) {
      filterSelectRef.current.value = 'filter by tag'
    }
  }

  const handleFilterSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    const storageItems: Images = JSON.parse(localStorage.getItem('images') || '{}')

    const selectedTag = e.target.value

    if (selectedTag === 'filter by tag') {
      return JSON.parse(localStorage.getItem('images') || '{}')
    }

    const filteredArray = Object.values(storageItems).filter((image) =>
      image.tags.includes(selectedTag)
    )

    const filteredImages = filteredArray.reduce((acc, image) => {
      acc[image.id] = image
      return acc
    }, {} as Images)

    dispatch({
      type: 'SET_IMAGES',
      payload: filteredImages,
    })
  }

  return (
    <div className="flex flex-col items-center gap-2 lg:pt-0 pt-8">
      <button
        className="w-fit disabled:opacity-25 bg-second font-bold py-1 px-2 rounded"
        disabled={isLoading}
        onClick={() => {
          fetchImageFromApi({ setIsLoading, dispatch })

          if (filterSelectRef.current) {
            filterSelectRef.current.value = 'filter by tag'
          }
        }}
      >
        <p className="text-third w-fit">{isLoading ? 'Loading...' : 'get cat'}</p>
      </button>

      <div className="flex gap-2">
        <button
          className="w-fit disabled:opacity-25 bg-second font-bold py-1 px-2 rounded"
          disabled={isLoading}
          onClick={handleFilterLikedImages}
        >
          <p className="text-third w-fit">liked</p>
        </button>

        <button
          className="w-fit disabled:opacity-25 bg-second font-bold py-1 px-2 rounded"
          disabled={isLoading}
          onClick={handleFilterAllImages}
        >
          <p className="text-third w-fit">all</p>
        </button>

        <select ref={filterSelectRef} onChange={handleFilterSelected}>
          <option>filter by tag</option>

          {state.tags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

const NoResultsFallback = ({ storageImages }: { storageImages: Image[] }) => {
  return (
    <div className="w-full h-ful flex flex-col flex-grow items-center pt-5 gap-8 lg:gap-16">
      <FaLongArrowAltUp className="text-second w-20 h-20" />
      <FaPaw className="text-third w-20 h-20" />

      <p className="text-varela text-second text-xl lg:text-3xl">
        {storageImages.length
          ? 'no cats found for this filter'
          : "let's get some cats first"}
      </p>
    </div>
  )
}
