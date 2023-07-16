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
import { likeImage, deleteImage, fetchImageFromApi, addTag } from './utils'
import { FaHeart, FaTrash, FaLongArrowAltUp, FaPaw } from 'react-icons/fa'
import { Modal } from '../../components/Modal'
import { IoCloseOutline } from 'react-icons/io5'
import { GiPawHeart } from 'react-icons/gi'
import { useMediaMatch } from 'rooks'

export const CatGrid = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [images, setImages] = useState<Images>(
    JSON.parse(localStorage.getItem('images') || '[]')
  )
  const [tags, setTags] = useState<string[]>(
    JSON.parse(localStorage.getItem('tags') || '[]')
  )

  const imagesArray = Object.values(images)

  const filterSelectRef = useRef<HTMLSelectElement>(null)

  const storageImages: Image[] = Object.values(
    JSON.parse(localStorage.getItem('images') || '[]')
  )

  return (
    <div className="max-w-[1200px] w-full flex flex-col gap-4 items-center">
      {isError ? (
        <div className="text-red-700">
          Something went wrong! Contact the cat god for guidance
        </div>
      ) : null}

      <CatGridButtons filterSelectRef={filterSelectRef} />

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
        {imagesArray.length ? (
          <div className="flex-grow w-full h-full py-4 columns-1 md:columns-2 lg:columns-3">
            {imagesArray.map((image) => (
              <Card key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="w-full h-ful flex flex-col flex-grow items-center pt-5 gap-8 lg:gap-16">
            <FaLongArrowAltUp className="text-second w-20 h-20" />
            <FaPaw className="text-third w-20 h-20" />

            <p className="text-varela text-second text-xl lg:text-3xl">
              {storageImages.length
                ? 'no cats found for this filter'
                : "let's get some cats first"}
            </p>
          </div>
        )}

        <Modal isVisible={isModalVisible}>
          <Tags />
        </Modal>
      </Context.Provider>
    </div>
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
                JSON.parse(localStorage.getItem('images') || '[]')
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
            setImages(JSON.parse(localStorage.getItem('images') || '[]'))

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
              localStorage.getItem('images') || '[]'
            )

            setImages(() => {
              const selectedTag = e.target.value
              if (selectedTag === 'filter by tag') {
                return JSON.parse(localStorage.getItem('images') || '[]')
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

const Card = ({ image }: { image: Image }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const isLargeDisplay = useMediaMatch('(min-width: 760px)')

  return (
    <>
      <div className={`relative ${isLoaded ? 'mb-8 lg:mb-4' : ''}`}>
        {isLargeDisplay && isLoaded ? <CardOverlay image={image} /> : null}

        <div>
          <img
            className="w-full h-full lg:rounded-lg rounded-t-lg"
            src={image?.url}
            alt="cat"
            onLoad={() => {
              setIsLoaded(true)
            }}
          />

          {!isLoaded ? <p className="h-32 text-white py-6">image is loading...</p> : ''}
        </div>

        {!isLargeDisplay && isLoaded ? <CardButtons image={image} /> : null}
      </div>
    </>
  )
}

const CardOverlay = ({ image }: { image: Image }) => {
  const { setImages } = useContext(Context)

  return (
    <div className="opacity-0 hover:opacity-100 flex absolute flex-col h-full w-full gap-2 justify-between">
      <div className="flex w-fit gap-2 m-2">
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => likeImage({ id: image.id, setImages })}
        >
          <FaHeart className={`${image.isLiked ? 'text-red-600' : 'text-gray-600'}`} />
        </button>

        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => deleteImage({ id: image.id, setImages })}
        >
          <FaTrash className="text-gray-700" />
        </button>
      </div>

      <OnImageTags image={image} />
    </div>
  )
}

const CardButtons = ({ image }: { image: Image }) => {
  const { setImages, setIsModalVisible, setSelectedImageId } = useContext(Context)

  return (
    <div className="w-full py-2 h-12 flex gap-2">
      <button
        className="p-2 h-full bg-gray-200 rounded"
        onClick={() => likeImage({ id: image.id, setImages })}
      >
        <FaHeart className={`${image.isLiked ? 'text-red-600' : 'text-gray-600'}`} />
      </button>

      <button
        className="p-2 h-full bg-gray-200 rounded"
        onClick={() => deleteImage({ id: image.id, setImages })}
      >
        <FaTrash className="text-gray-700" />
      </button>

      <div className="self-end h-full">
        <button
          className="h-full px-2 text-xs bg-gradient-to-r border-2 border-second from-purple-800 to-purple-600 text-second font-bold rounded cursor-pointer"
          onClick={() => {
            setIsModalVisible((prev) => !prev)
            setSelectedImageId(image.id)
          }}
        >
          TAGS
        </button>
      </div>
    </div>
  )
}

const Tags = () => {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const { setImages, setIsModalVisible, selectedImageId, images, tags, setTags } =
    useContext(Context)

  if (!selectedImageId) return null

  const image = images[selectedImageId]

  if (!image) return null

  const handleAddTagToImage = (tag: string) => {
    const storageItems: Images = JSON.parse(localStorage.getItem('images') || '[]')

    setImages((prevImages) => {
      const updatedImages = { ...prevImages }

      updatedImages[image.id].tags = !updatedImages[image.id].tags.includes(tag)
        ? [...updatedImages[image.id].tags, tag]
        : updatedImages[image.id].tags

      localStorage.setItem(
        'images',
        JSON.stringify({ ...storageItems, [image.id]: updatedImages[image.id] })
      )

      return updatedImages
    })
  }

  const handleRemoveTagFromImage = (tag: string) => {
    const storageItems: Images = JSON.parse(localStorage.getItem('images') || '[]')

    setImages((prevImages) => {
      console.log('storageItems', storageItems)
      const updatedImages = { ...prevImages }

      updatedImages[image.id].tags = updatedImages[image.id].tags.filter(
        (imageTag) => imageTag !== tag
      )

      localStorage.setItem(
        'images',
        JSON.stringify({ ...storageItems, [image.id]: updatedImages[image.id] })
      )

      return updatedImages
    })
  }

  const handleAddNewTag = () => {
    const trimmedValue = inputValue.trim()

    if (trimmedValue.length > 8) {
      setError('Limit exceeded (8 chars)')
      return
    }

    if (trimmedValue) {
      addTag({
        tag: inputValue,
        setTags,
      })
    }

    setError('')

    setInputValue('')
  }

  return (
    <div className="w-full max-w-none lg:max-w-5xl lg:w-[50vw] min-h-[24rem] flex flex-col bg-fifth gap-2 p-2">
      <div className="w-full flex justify-end pr-2">
        <button
          className="justify-end bg-white"
          onClick={() => setIsModalVisible((prev) => !prev)}
        >
          <IoCloseOutline className="bg-red-400 rounded text-white" />
        </button>
      </div>

      <div className="w-full h-full flex flex-col gap-10 justify-between">
        <div className="flex flex-col gap-4 px-2 border-t-2 border-b-gray-400">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-2 py-2">
            <p className="text-2xl">Available tags</p>
            {error ? <p className="text-red-700">{error}</p> : null}

            <div className="flex w-full lg:w-auto flex-col lg:flex-row gap-2 items-end">
              <input
                placeholder="Type new tag"
                className=" w-full lg:w-auto bg-fifth border-b-2 border-green-600 focus:outline-none"
                onChange={(e) => {
                  setInputValue(e.target.value)
                }}
                value={inputValue}
              />

              <button
                onClick={handleAddNewTag}
                className="ml-0 lg:ml-4 w-full lg:w-fit text-white text-xs bg-green-500 h-[30px] px-2 rounded-lg"
              >
                Add Tag
              </button>
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-2 overflow-y-scroll max-h-[8rem]">
            {tags.length
              ? tags
                  .filter((tag) => !image.tags.includes(tag))
                  .map((tag) => (
                    <button
                      className="w-fit p-1 px-2 text-sm bg-gray-400 text-white rounded cursor-pointer"
                      onClick={() => {
                        handleAddTagToImage(tag)
                      }}
                      key={`all-${tag}`}
                    >
                      <p>{tag}</p>
                    </button>
                  ))
              : 'no tags'}
          </div>
        </div>

        <div className="flex flex-col  max-h-[10rem] gap-4 px-2 border-t-2 border-b-gray-400 py-2">
          <p className="text-2xl">Image tags</p>

          <div className="w-full flex flex-wrap gap-2 overflow-y-scroll max-h-[8rem]">
            {image.tags.length
              ? image.tags.map((tag) => (
                  <button
                    className="w-fit p-1 px-2 text-sm bg-gray-400 text-white rounded"
                    onClick={() => {
                      handleRemoveTagFromImage(tag)
                      console.log('removes')
                    }}
                    key={`image-${tag}`}
                  >
                    <p>{tag}</p>
                  </button>
                ))
              : 'This image has no tags'}
          </div>
        </div>
      </div>
    </div>
  )
}

const OnImageTags = ({ image }: { image: Image }) => {
  const numberOfDisplayedTags = 5

  const isWideScreen = useMediaMatch('(min-width: 1024px)')

  const { setSelectedImageId, setIsModalVisible, setImages } = useContext(Context)

  return (
    <div className="bottom-0 w-full flex-wrap flex gap-2 backdrop-blur-md p-2">
      <button
        className="p-1 px-2 text-xs bg-gradient-to-r border-2 border-second from-purple-800 to-purple-600 text-second font-bold rounded cursor-pointer"
        onClick={(e) => {
          setIsModalVisible((prev) => !prev)
          setSelectedImageId(image.id)
        }}
      >
        TAGS
      </button>

      {image.tags.length
        ? image.tags.slice(0, numberOfDisplayedTags).map((tag) => (
            <button
              key={`display-${tag}`}
              className="relative text-xs bg-gradient-to-r from-purple-800 to-purple-600 rounded-lg  text-white p-1 pr-6 pl-2"
              onClick={() => {
                if (isWideScreen) {
                  const storageImages: Images = JSON.parse(
                    localStorage.getItem('images') || '[]'
                  )

                  setImages((prevImages) => {
                    const updatedImages = { ...prevImages }
                    updatedImages[image.id].tags = updatedImages[image.id].tags.filter(
                      (imageTag) => imageTag !== tag
                    )

                    localStorage.setItem(
                      'images',
                      JSON.stringify({
                        ...storageImages,
                        [image.id]: updatedImages[image.id],
                      })
                    )
                    return updatedImages
                  })
                } else {
                  setSelectedImageId(image.id)
                  setIsModalVisible(true)
                }
              }}
            >
              {tag}
              <IoCloseOutline className="absolute top-[8px] right-1" />
            </button>
          ))
        : null}

      {image.tags.length > numberOfDisplayedTags ? (
        <span className="text-xs bg-gradient-to-r from-purple-800 to-purple-600 rounded-lg font-semibold text-white p-1">
          + {image.tags.length - numberOfDisplayedTags}
        </span>
      ) : null}
    </div>
  )
}

const Context = createContext<{
  images: Images
  setImages: Dispatch<SetStateAction<Images>>
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
  selectedImageId: string | null
  setSelectedImageId: Dispatch<SetStateAction<string>>
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  setIsError: Dispatch<SetStateAction<boolean>>
}>({
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

export const Footer = () => {
  return (
    <div className="bg-first h-[10vh] w-full mt-auto flex items-center justify-center text-second text-sm lg:text-base">
      <div className="whitespace-pre-line">
        made with
        {
          <GiPawHeart className="w-5 h-5 lg:w-10 lg:h-10 text-third mx-1 lg:mx-2 inline" />
        }
        by
      </div>
      <a
        href="https://github.com/raicubogdan"
        target="_blank"
        className="mx-2 border-b-2 border-b-2 border-second"
      >
        /raicubogdan
      </a>
    </div>
  )
}
