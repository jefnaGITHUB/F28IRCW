import { Link, NavLink, useLocation } from 'react-router'
import homeLogo from '../../assets/home_icon.svg';

function Navbar() {
  const currentLocation = useLocation();
  const isHome = currentLocation.pathname === "/";
  const isResult = currentLocation.pathname === '/results';
  const isSearches = currentLocation.pathname === '/searches';

  return (
    <nav className="text-white px-6 py-4 flex items-center justify-between relative border-b-1">
      <Link to="/">
        <img className='h-8 w-8 object-contain' src={homeLogo}/>
      </Link>
      <div className="absolute left-1/2 transform -translate-x-1/2 space-x-8 text-lg text-[#F2F0EF]/88">
        <NavLink
          to="/"
          className={isHome ? 'underline font-semibold' : 'underline-none'}
        >
            Home
        </NavLink>

        <NavLink
          to={isHome || isSearches ? "/" : "/results"}
          className={
            isResult ? 'underline font-semibold' : 'underline-none hidden'
          }
        >
            Results
        </NavLink>

        <NavLink
          to="/searches"
          className={isSearches ? 'underline font-semibold' : 'underline-none'}
        >
            Searches
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
