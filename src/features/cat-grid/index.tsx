import {
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  createContext,
  useRef,
  RefObject,
} from 'react'
import { Image, Images } from './types'
import { fetchImageFromApi } from './utils'
import { FaLongArrowAltUp, FaPaw } from 'react-icons/fa'
import { Modal } from '../../components/Modal'
import { Tags } from '../../components/Tags'
import { Card } from '../../components/Card'

export const CatGrid = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [images, setImages] = useState<Images>(
    JSON.parse(localStorage.getItem('images') || '{}')
  )
  const [tags, setTags] = useState<string[]>(
    JSON.parse(localStorage.getItem('tags') || '[]')
  )

  const stateImagesArray = Object.values(images)

  const filterSelectRef = useRef<HTMLSelectElement>(null)

  const storageImages: Image[] = Object.values(
    JSON.parse(localStorage.getItem('images') || '{}')
  )

  return (
    <Context.Provider
      value={{
        images,
        setImages,
        tags,
        setTags,
        selectedImageId,
        setSelectedImageId,
        setIsModalVisible,
        isLoading,
        setIsError,
        setIsLoading,
      }}
    >
      <div className="max-w-[1200px] w-full flex flex-col gap-4 items-center">
        {isError ? (
          <div className="text-red-700">
            Something went wrong! Contact the cat god for guidance
          </div>
        ) : null}

        <CatGridButtons filterSelectRef={filterSelectRef} />

        {stateImagesArray.length ? (
          <div className="flex-grow w-full h-full py-4 columns-1 md:columns-2 lg:columns-3">
            {stateImagesArray.map((image) => (
              <Card key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <NoResultsFallback storageImages={storageImages} />
        )}

        {selectedImageId && (
          <Modal isVisible={isModalVisible}>
            <Tags />
          </Modal>
        )}
      </div>
    </Context.Provider>
  )
}

const CatGridButtons = ({
  filterSelectRef,
}: {
  filterSelectRef: RefObject<HTMLSelectElement>
}) => {
  const { setImages, setIsLoading, isLoading, setIsError, tags } = useContext(Context)

  return (
    <div className="flex flex-col items-center gap-2 lg:pt-0 pt-8">
      <button
        className="w-fit disabled:opacity-25 bg-second font-bold py-1 px-2 rounded"
        disabled={isLoading}
        onClick={() => {
          fetchImageFromApi({ setImages, setIsLoading, setIsError })

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
          onClick={() =>
            setImages(() => {
              const storageImages: Image[] = Object.values(
                JSON.parse(localStorage.getItem('images') || '{}')
              )

              const filteredArray = storageImages.filter((image: Image) => image.isLiked)

              if (filterSelectRef.current) {
                filterSelectRef.current.value = 'filter by tag'
              }

              return filteredArray.reduce((acc, image) => {
                acc[image.id] = image
                return acc
              }, {} as Images)
            })
          }
        >
          <p className="text-third w-fit">liked</p>
        </button>

        <button
          className="w-fit disabled:opacity-25 bg-second font-bold py-1 px-2 rounded"
          disabled={isLoading}
          onClick={() => {
            setImages(JSON.parse(localStorage.getItem('images') || '{}'))

            if (filterSelectRef.current) {
              filterSelectRef.current.value = 'filter by tag'
            }
          }}
        >
          <p className="text-third w-fit">all</p>
        </button>

        <select
          ref={filterSelectRef}
          onChange={(e) => {
            const storageItems: Images = JSON.parse(
              localStorage.getItem('images') || '{}'
            )

            setImages(() => {
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

              return filteredImages
            })
          }}
        >
          <option>filter by tag</option>
          {tags.map((tag) => (
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

export const Context = createContext<ContextType>({
  images: {},
  setImages: () => [],
  tags: [],
  setTags: () => [],
  selectedImageId: '',
  setSelectedImageId: () => '',
  setIsModalVisible: () => false,
  setIsError: () => false,
  isLoading: false,
  setIsLoading: () => false,
})

type ContextType = {
  images: Images
  setImages: Dispatch<SetStateAction<Images>>
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
  selectedImageId: string
  setSelectedImageId: Dispatch<SetStateAction<string>>
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  setIsError: Dispatch<SetStateAction<boolean>>
}
