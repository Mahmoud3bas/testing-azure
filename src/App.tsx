import { useState } from 'react'
import './App.css'
import FileUpload from './FileUpload'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Azure Blob Storage File Upload</h1>
      <FileUpload />
    </div>
  )
}

export default App
