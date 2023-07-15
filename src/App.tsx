import { CatGrid } from './features/cat-grid'

function App() {
  return (
    <div className="w-full flex flex-col min-h-[100vh] items-center gap-4 p-4 border-2 border-red-600">
      <h1>catSPLASH</h1>

      <CatGrid />
    </div>
  )
}

export default App
