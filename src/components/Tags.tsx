import { useContext, useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { Images, Image } from '../features/cat-grid/types'
import { Context } from '../features/cat-grid'

export const Tags = () => {
  const { setIsModalVisible, selectedImageId, images } = useContext(Context)

  const image = images[selectedImageId]

  if (!image) {
    return null
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
        <AvailableTags image={image} />
        <ImageTags image={image} />
      </div>
    </div>
  )
}

const ImageTags = ({ image }: { image: Image }) => {
  const { setImages } = useContext(Context)

  const handleRemoveTagFromImage = (tag: string) => {
    const storageItems: Images = JSON.parse(localStorage.getItem('images') || '{}')

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
  return (
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
  )
}

const AvailableTags = ({ image }: { image: Image }) => {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const { setImages, setTags, tags } = useContext(Context)

  const handleAddTagToImage = (tag: string) => {
    const storageItems: Images = JSON.parse(localStorage.getItem('images') || '{}')

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

  const handleAddNewTag = () => {
    const trimmedValue = inputValue.trim()

    if (trimmedValue.length > 8) {
      setError('Limit exceeded (8 chars)')
      return
    }

    if (trimmedValue) {
      setTags((prev) => {
        const updatedTags = !prev.includes(inputValue) ? [inputValue, ...prev] : prev

        localStorage.setItem('tags', JSON.stringify(updatedTags))

        return updatedTags
      })
    }

    setError('')
    setInputValue('')
  }

  return (
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
  )
}

export const OnImageTags = ({ image }: { image: Image }) => {
  const numberOfDisplayedTags = 5

  const { setSelectedImageId, setIsModalVisible, setImages } = useContext(Context)

  const handleRemoveTag = ({ tag }: { tag: string }) => {
    const storageImages: Images = JSON.parse(localStorage.getItem('images') || '{}')

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
  }

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
              onClick={() => handleRemoveTag({ tag })}
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
