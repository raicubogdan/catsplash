import { ReactElement, Dispatch, SetStateAction } from 'react'

export const Modal = ({
  children,
  isVisible,
  setIsModalVisible,
}: {
  children: ReactElement
  isVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <div
      className={` ${
        !isVisible ? 'hidden' : ''
      } fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10`}
    >
      <div className="flex w-full h-full justify-center items-center">
        <div className="w-96 h-96 bg-white">
          <button
            className="p-2 mb-4 bg-white"
            onClick={() => setIsModalVisible((prev) => !prev)}
          >
            x
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}
