import { useState, useContext } from 'react'
import { FaHeart, FaTrash } from 'react-icons/fa'
import { useMediaMatch } from 'rooks'
import { Context } from '../features/cat-grid'
import { likeImage, deleteImage } from '../features/cat-grid/utils'
import { OnImageTags } from './Tags'
import { Image } from '../features/cat-grid/types'

export const Card = ({ image }: { image: Image }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const isLargeDisplay = useMediaMatch('(min-width: 760px)')

  return (
    <>
      <div className={`relative ${isImageLoaded ? 'mb-8 lg:mb-4' : ''}`}>
        {isLargeDisplay && isImageLoaded ? <CardOverlay image={image} /> : null}

        <div>
          <img
            className="w-full h-full lg:rounded-lg rounded-t-lg"
            src={image?.url}
            alt="cat"
            onLoad={() => {
              setIsImageLoaded(true)
            }}
          />

          {!isImageLoaded ? (
            <p className="h-32 text-white py-6">image is loading...</p>
          ) : (
            ''
          )}
        </div>

        {!isLargeDisplay && isImageLoaded ? <MobileCardButtons image={image} /> : null}
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

const MobileCardButtons = ({ image }: { image: Image }) => {
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
