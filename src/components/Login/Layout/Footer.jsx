import React from 'react'
import { AiFillFacebook, AiFillInstagram, AiFillYoutube, AiOutlineTwitter } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { footerProductLinks } from '../../../static/data'
import { footercompanyLinks } from '../../../static/data'
import { footerSupportLinks } from '../../../static/data'
const Footer = () => {
  return (
    <div className='bg-[#000] text-white'>
       <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-[#342ac8] py-7">
         <h1 className='lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5'>
            <span className='text-[#56d879]'>
               Subscribe
            </span> us for get news <br/>
            events and offers
         </h1>
         <div className="flex gap-5">
              <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  className="w-full sm:flex-1 px-5 py-3 rounded-xl border border-white/20 bg-white text-gray-800 placeholder:text-gray-500 shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
                />
             <button className='bg-[#56d879] hover:bg-teal-500 duration-300 px-5 py-2.5 rounded-md 
             text-white md:w-auto w-full '>
                Submit
             </button>
         </div>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 
       py-16 sm:text-center">
        <ul className='px-5 items-center sm:text-start flex sm:block flex-col items-center'>
           <img
               src="https://cdn.logojoy.com/wp-content/uploads/2018/05/30143409/5_big.png"
               alt="Logo"
               className="w-32 sm:w-36 md:w-40 lg:w-44 h-auto object-contain mx-auto sm:mx-0 rounded-xl bg-white p-2 shadow-lg hover:scale-105 transition-all duration-300"
           />
            <br/>
            <p>The home and elements needed to create beatiful products.</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-5">
               <AiFillFacebook
                        size={24}
                        className="cursor-pointer text-white hover:text-blue-500
                         hover:scale-110 transition-all duration-300"
                        />
              <AiOutlineTwitter
                        size={24}
                        className="cursor-pointer text-white hover:text-sky-400
                         hover:scale-110 transition-all duration-300"
                         />
              <AiFillInstagram
                       size={24}
                       className="cursor-pointer text-white hover:text-pink-500
                        hover:scale-110 transition-all duration-300"
                        />
              <AiFillYoutube
                       size={24}
                       className="cursor-pointer text-white hover:text-red-500
                       hover:scale-110 transition-all duration-300"
                       />
             </div>
         </ul>
         <ul className='text-center'>
           <h1 className='mb-1 font-semibold'>
             Company
           </h1>
           {footerProductLinks.map((link)=>(
            <li key={link.name}>
            <Link to={link.link} className='text-gray-400 hover:text-teal-400 duration-300 
            text-sm cursor-pointer leading-6'>
              {link.name}
            </Link>
            </li>
           ))}
         </ul>
          <ul className='text-center'>
           <h1 className='mb-1 font-semibold'>
             Shop
           </h1>
           {footercompanyLinks.map((link)=>(
            <li key={link.name}>
            <Link to={link.link} className='text-gray-400 hover:text-teal-400 duration-300 
            text-sm cursor-pointer leading-6'>
              {link.name}
            </Link>
            </li>
           ))}
         </ul>
          <ul className='text-center'>
           <h1 className='mb-1 font-semibold'>
             Support
           </h1>
           {footerSupportLinks.map((link)=>(
            <li key={link.name}>
            <Link to={link.link} className='text-gray-400 hover:text-teal-400 duration-300 
            text-sm cursor-pointer leading-6'>
              {link.name}
            </Link>
            </li>
           ))}
         </ul>
        
       </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center
         pt-2 text-gray-400 text-sm pb-8">
          <span>@ 2026 Becodemy.All rights reserved.</span>
          <span>Term's Privacy Policy</span>
          <span>University of Sahiwal,Sahiwal</span>
         </div>
    </div>
  )
}

export default Footer 