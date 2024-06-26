import React from 'react'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { Link, matchPath } from 'react-router-dom'
import { NavbarLinks } from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Navbar = () => {

    const{token} = useSelector((state) => state.auth)
    const{user} = useSelector((state)=> state.profile)
    const{totalItems} = useSelector((state) => state.cart)
    const location = useLocation()
    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-white'>
        <div className='w-8/12 flex max-w-maxContent items-center justify-between'>
        {/* logo */}
            <Link to="/">
                <img src={logo} width={160} alt="img" height={32} loading='lazy'/>
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
                                    <p className={`${matchRoute(link?.path) ? "text-yellow-25":"text-richblack-25"}`}>{link.title}</p>
                                    </Link>
                                )
                            }
                        </li>
                    )) 
                }
            </ul>
        </nav>

        {/* login/signup/dashboard */}
        <div className='flex gap-x-4 items-center'>

        </div>
            

        </div>
    </div>
  )
}

export default Navbar