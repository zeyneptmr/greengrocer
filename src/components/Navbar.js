import React from 'react';
import '../styles/Navbar.css'
import Logo from '../logo.svg';

function Navbar() {
  return (
    <header className='header'>

      <div className='logo-container'>
        <img src={Logo} alt="Logo" className="logo" />
        <a href='/' className='logo-name'>Logo</a>
      </div>
      
      <nav className='navbaritems'>
        <a href='/'>Home</a>
        <a href='/'>About</a>
        <a href='/'>Services</a>
        <a href='/'>Contact</a>
      </nav>

      <div className='icons'>


      </div>
  
    </header>
  );
}


export default Navbar;