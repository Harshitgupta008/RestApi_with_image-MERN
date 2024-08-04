import './App.css'
import UploadImage from './UploadImage'
import { Routes,Route } from 'react-router-dom'
import Views from './Views'
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<UploadImage/>}/>
      <Route path='/views' element={<Views/>}/>
      <Route path='/views/:action' element={<Views/>}/>
    </Routes>
      
    </>
  )
}

export default App
