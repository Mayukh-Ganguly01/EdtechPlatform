import React from 'react'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { Link } from 'react-router-dom'
import { NavbarLinks } from '../../data/navbar-links'


const Navbar = () => {
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-white'>
        <div className='w-8/12 flex max-w-maxContent items-center justify-between'>
        {/* logo */}
            <Link to="/">
                <img src={logo} width={160} height={32} loading='lazy'/>
            </Link>

        {/* navlinks */}
        <nav>
            <ul className='flex gap-x-6 text-richblack-5'>
                {
                    NavbarLinks.map((link, index) =>(
                        <li key={index}>
                            {
                                link.title === "Catalog" ? (<div></div>) : (
                                    <Link to={link?.path}>
                                        <p className='text-yellow-25'>{link.title}</p>
                                    </Link>
                                )
                            }
                        </li>
                    )) 
                }
            </ul>
        </nav>
        </div>
    </div>
  )
}

export default Navbar