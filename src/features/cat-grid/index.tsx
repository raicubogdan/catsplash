import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  createContext,
  useContext,
} from 'react'
import { Modal } from '../../components/Modal'
import { Image, Images } from './types'
import { likeImage, deleteImage, fetchImageFromApi, addTag } from './utils'

export const CatGrid = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [images, setImages] = useState<Images>(
    JSON.parse(localStorage.getItem('images') || '[]')
  )
  const [tags, setTags] = useState<string[]>(
    JSON.parse(localStorage.getItem('tags') || '[]')
  )

  const imagesArray = Object.values(images)

  return (
    <>
      {isError ? (
        <div className="text-red-700">
          Something went wrong! Contact the cat god for guidance
        </div>
      ) : null}

      <button
        className={`disabled:opacity-25 bg-blue-700 text-white font-bold py-2 px-4 rounded`}
        disabled={isLoading}
        onClick={() => fetchImageFromApi({ setImages, setIsLoading, setIsError })}
      >
        {isLoading ? 'Loading cat...' : 'Get cat'}
      </button>

      <Context.Provider value={{ images, setImages, tags, setTags }}>
        <div className="w-[900px] h-full border-2 border-green-500 p-4 columns-3 ">
          {imagesArray.length ? (
            imagesArray.map((image) => <Card key={image.id} image={image} />)
          ) : (
            <div>no cats</div>
          )}
        </div>
      </Context.Provider>
    </>
  )
}

const Card = ({ image }: { image: Image }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { setImages } = useContext(Context)

  const handleLikeImage = useCallback(
    () => likeImage({ id: image.id, setImages }),
    [image.id, setImages]
  )
  const handleDeleteImage = useCallback(
    () => deleteImage({ id: image.id, setImages }),
    [image.id, setImages]
  )

  return (
    <>
      <div className={`relative mb-4`}>
        <div className="opacity-0 hover:opacity-100 flex absolute flex-col h-full w-full gap-2 p-2 justify-between">
          <div className="flex bg-white w-fit">
            <button onClick={handleLikeImage} className="w-fit border-red-600 border-2">
              {image.isLiked ? 'unlike' : 'like'}
            </button>
            <button onClick={handleDeleteImage} className="w-fit border-red-600 border-2">
              delete
            </button>
          </div>

          <div className="bottom-0 border-gray-950 border-2 w-fit">
            {image.tags.length
              ? image.tags.map((tag) => (
                  <span
                    key={`display-${tag}`}
                    className="bg-gray-200 rounded-full text-sm font-semibold text-gray-700"
                  >
                    #{tag}
                  </span>
                ))
              : null}

            <button
              className="px-2 bg-white"
              onClick={() => setIsModalVisible((prev) => !prev)}
            >
              +
            </button>
          </div>
        </div>

        <img className="w-full h-full" src={image?.url} alt="cat" />
      </div>

      <Modal isVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
        <Tags image={image} />
      </Modal>
    </>
  )
}

const Tags = ({ image }: { image: Image }) => {
  const [inputValue, setInputValue] = useState('')

  const { setImages, tags, setTags } = useContext(Context)

  const handleAddTagToImage = (tag: string) => {
    setImages((prevImages) => {
      const updatedImages = { ...prevImages }
      updatedImages[image.id].tags = !updatedImages[image.id].tags.includes(tag)
        ? [...updatedImages[image.id].tags, tag]
        : updatedImages[image.id].tags

      localStorage.setItem('images', JSON.stringify(updatedImages))

      return updatedImages
    })
  }

  const handleRemoveTagFromImage = (tag: string) => {
    setImages((prevImages) => {
      const updatedImages = { ...prevImages }
      updatedImages[image.id].tags = updatedImages[image.id].tags.filter(
        (imageTag) => imageTag !== tag
      )

      localStorage.setItem('images', JSON.stringify(updatedImages))
      return updatedImages
    })
  }

  const handleAddNewTag = () => {
    addTag({
      tag: inputValue,
      setTags,
    })

    setInputValue('')
  }

  return (
    <div className="h-96 w-96 bg-white">
      <div className="border-2 border-red-500">
        <p>all tags</p>
        {tags.length
          ? tags
              .filter((tag) => !image.tags.includes(tag))
              .map((tag) => (
                <div
                  className="cursor-pointer"
                  onClick={() => handleAddTagToImage(tag)}
                  key={`all-${tag}`}
                >
                  <p>{tag}</p>
                </div>
              ))
          : 'no tags'}
        <div>
          <input
            className="bg-gray-300"
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
            value={inputValue}
          />
          <button onClick={handleAddNewTag}>add new tag</button>
        </div>
      </div>

      <div className="border-2 border-purple-500">
        <p>image tags</p>

        {image.tags.length
          ? image.tags.map((tag) => (
              <div
                className="cursor-pointer"
                onClick={() => handleRemoveTagFromImage(tag)}
                key={`image-${tag}`}
              >
                <p>{tag}</p>
              </div>
            ))
          : 'no tags'}
      </div>
    </div>
  )
}

const Context = createContext<{
  images: Images
  setImages: Dispatch<SetStateAction<Images>>
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
}>({
  images: {},
  setImages: () => [],
  tags: [],
  setTags: () => [],
})
