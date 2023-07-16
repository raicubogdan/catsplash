import { ContactMenu, ContactMenuMobile } from './components/ContactMenu'
import { CatGrid, Footer } from './features/cat-grid'

function App() {
  return (
    <>
      <div className="bg-first min-h-[100vh] flex flex-col items-center gap-4 px-4 pb-20">
        <ContactMenuMobile />
        <ContactMenu />

        <h1 className="hidden lg:block lg:pt-6 font-varela text-second text-5xl">
          catsplash
        </h1>

        <h1 className="pt-16 lg:pt-0 font-varela text-second text-xs italic">{`(unsplash but with cats. don't worry, they won't run away after refresh)`}</h1>

        <CatGrid />
      </div>

      <Footer />
    </>
  )
}

export default App
