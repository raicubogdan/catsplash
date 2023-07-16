import { GiPawHeart } from 'react-icons/gi'

export const Footer = () => {
  return (
    <div className="bg-first h-[10vh] w-full mt-auto flex items-center justify-center text-second text-sm lg:text-base">
      <div className="whitespace-pre-line">
        made with{' '}
        {
          <GiPawHeart className="w-5 h-5 lg:w-10 lg:h-10 text-third mx-1 lg:mx-2 inline" />
        }{' '}
        by
      </div>
      <a
        href="https://github.com/raicubogdan"
        target="_blank"
        className="mx-2  border-b-2 border-second"
      >
        /raicubogdan
      </a>
    </div>
  )
}
