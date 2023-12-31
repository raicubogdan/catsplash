import { Footer } from './components/Footer'
import { SocialMediaMenu, SocialMediaMenuMobile } from './components/SocialMediaMenu'
import { CatGrid } from './features/cat-grid'

function App() {
  return (
    <>
      <div className="font-varela bg-first min-h-[100vh] flex flex-col items-center gap-10 px-4 lg:px-16 pb-10">
        <SocialMediaMenuMobile />
        <SocialMediaMenu />

        <div className="flex flex-col gap-4 items-center">
          <h1 className="hidden lg:block lg:pt-6 text-second text-5xl">catsplash</h1>

          <h1 className="lg:block hidden pt-16 lg:pt-0 text-second text-xs italic">{`(unsplash but with cats. don't worry, they won't run away after refresh)`}</h1>
        </div>

        <CatGrid />
      </div>

      <Footer />
    </>
  )
}

export default App
