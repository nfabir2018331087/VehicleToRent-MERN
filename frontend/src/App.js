import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Rent from './pages/Rent'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/rent' element={<Rent />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
