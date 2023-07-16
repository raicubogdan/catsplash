import { useState } from 'react'
import { FaGithubAlt, FaLinkedinIn } from 'react-icons/fa'
import { IoCloseOutline } from 'react-icons/io5'
import { RxHamburgerMenu } from 'react-icons/rx'

export const SocialMediaMenu = () => {
  return (
    <div className="hidden lg:block top-20 left-0 fixed">
      <div className="flex flex-col">
        <div className="h-[5vmin] w-[5vmin] bg-second">
          <a href="https://github.com/raicubogdan" target="_blank">
            <FaGithubAlt className="h-full w-full text-third pt-[5px]" color="#eb9486" />
          </a>
        </div>

        <div className="h-[5vmin] w-[5vmin] bg-third">
          <a href="https://www.linkedin.com/in/bogdan-raicu-45a393131/ target='_blank'">
            <FaLinkedinIn className="h-full w-full text-second pt-[5px]" />
          </a>
        </div>
      </div>
    </div>
  )
}

export const SocialMediaMenuMobile = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  return (
    <>
      <div className="fixed lg:hidden w-full flex justify-between items-center bg-first z-20 border-b-2 border-second">
        <h1 className="text-second text-xl ml-4">catsplash</h1>

        {isMenuVisible ? (
          <IoCloseOutline
            className="w-8 h-8 text-second z-20 text-2xl font-bold m-2 rounded-lg right-2 cursor-pointer"
            onClick={() => setIsMenuVisible(false)}
          />
        ) : (
          <RxHamburgerMenu
            className="w-8 h-8 text-second z-20 text-2xl font-bold m-2 rounded-lg right-2 cursor-pointer"
            onClick={() => setIsMenuVisible(true)}
          />
        )}
      </div>

      {isMenuVisible && (
        <div className="fixed h-[100vh] w-full z-10 backdrop-blur-lg flex flex-col items-center justify-end">
          <a
            className="h-[10vh] w-full bg-second p-4"
            href="https://github.com/raicubogdan"
            target="_blank"
          >
            <FaGithubAlt className="w-full h-full text-third" />
          </a>

          <a
            className="h-[10vh] w-full bg-third p-4"
            href="https://www.linkedin.com/in/bogdan-raicu-45a393131/ target='_blank'"
          >
            <FaLinkedinIn
              className="w-full h-full text-second"
              style={{ paddingTop: '5px' }}
            />
          </a>

          <div className="h-[10vh] w-full bg-first flex justify-center p-4">
            <a href="https://6tpgds-3000.csb.app/" target="_blank">
              <img src="/src/assets/portfolio-logo.png" className=" h-full text-second" />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
