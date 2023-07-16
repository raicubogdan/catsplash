import { ReactElement } from 'react'

export const Modal = ({
  children,
  isVisible,
}: {
  children: ReactElement
  isVisible: boolean
}) => {
  return (
    <div
      className={` ${
        !isVisible ? 'hidden' : ''
      } fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-30 p-4`}
    >
      {children}
    </div>
  )
}
