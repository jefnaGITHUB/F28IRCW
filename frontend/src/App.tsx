import { Routes, Route } from "react-router";
import Home from './components/pages/Home'
import Results from './components/pages/Results'
import Navbar from './components/navBar/navBar';
import Livechat from './components/pages/Livechat'
import ViewSearches from './components/pages/ViewSearches'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/searches" element={<ViewSearches />} />
      </Routes>
      <Livechat />
    </>
  )
}

export default App
