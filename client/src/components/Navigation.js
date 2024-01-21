import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Ma3icsLOGO from '../images/MA331.png'

const Navigation = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex items-center justify-between p-4">
      <img  src={Ma3icsLOGO} width="100px" height="100px"/>

      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="text-purple-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          {isMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'}`}>
        {/* Desktop Menu or Mobile Menu */}
        <div className="flex items-baseline space-x-7">
          <Link to="/" className="text-purple-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Home
          </Link>
          <Link to="/roadmap" className="text-purple-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
