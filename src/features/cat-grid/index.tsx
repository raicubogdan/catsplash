import { useState, useRef, RefObject, ChangeEvent, useContext } from 'react'
import { Image, Images } from './types'
import { fetchImageFromApi } from './utils'
import { FaLongArrowAltUp, FaPaw } from 'react-icons/fa'
import { Modal } from '../../components/Modal'
import { ModalTags } from '../../components/Tags'
import { Card } from '../../components/Card'
import { Context } from './reducer/reducer'

export const CatGrid = () => {
  // TODO: create separate branch for redux
  // TODO: create separate branch for mobx
  const { state } = useContext(Context)
  const stateImagesArray: Image[] = Object.values(state.images || [])

  const filterSelectRef = useRef<HTMLSelectElement>(null)

  const storageImages: Image[] = Object.values(
    JSON.parse(localStorage.getItem('state') || '{}').images || {}
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
          <ModalTags />
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
  const { state, dispatch } = useContext(Context)

  const [isLoading, setIsLoading] = useState(false)

  const handleFilterLikedImages = () => {
    const storageImages: Images = JSON.parse(
      localStorage.getItem('state') || '{}'
    ).images

    const filteredArray = Object.values(storageImages).filter(
      (image: Image) => image.isLiked
    )

    const updatedImages = filteredArray.reduce((acc, image) => {
      acc[image.id] = image
      return acc
    }, {} as Images)

    dispatch({
      type: 'SET_IMAGES',
      payload: { storageImages, stateImages: updatedImages },
    })

    if (filterSelectRef.current) {
      filterSelectRef.current.value = 'filter by tag'
    }
  }

  const handleFilterAllImages = () => {
    const storageImages = JSON.parse(
      localStorage.getItem('state') || '{}'
    ).images

    dispatch({
      type: 'SET_IMAGES',
      payload: {
        storageImages,
        stateImages: storageImages,
      },
    })

    if (filterSelectRef.current) {
      filterSelectRef.current.value = 'filter by tag'
    }
  }

  const handleFilterByTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const storageImages: Images = JSON.parse(
      localStorage.getItem('state') || '{}'
    ).images

    const selectedTag = e.target.value

    if (selectedTag === 'filter by tag') return

    const filteredArray = Object.values(storageImages).filter((image) =>
      image.tags.includes(selectedTag)
    )

    const filteredImages = filteredArray.reduce((acc, image) => {
      acc[image.id] = image
      return acc
    }, {} as Images)

    dispatch({
      type: 'SET_IMAGES',
      payload: { storageImages, stateImages: filteredImages },
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
        <p className="text-third w-fit">
          {isLoading ? 'Loading...' : 'get cat'}
        </p>
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

        <select ref={filterSelectRef} onChange={handleFilterByTag}>
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
