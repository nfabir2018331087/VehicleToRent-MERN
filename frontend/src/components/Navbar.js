//Different types of navbar for different page with props.

import React, {useState} from 'react';

const Navbar = ({pageName}) => {
  var buttonName = "Reservation Page"
  var url = '/rent'

  if(pageName === "rent"){
    buttonName = "Back to Home"
    url = '/'
  }

  return (
    <nav className="bg-white p-4 border-b-2 border-emerald-600">
      <div className="container mx-auto flex justify-between items-center">
        <a href='/' className="text-emerald-500 text-3xl font-bold ml-12">VehicleToRent Inc</a>
        <div>
          <a  href={url} className="inline-flex items-center justify-center transition duration-300 px-5 py-3 mr-6 text-base font-medium text-center text-white rounded-lg bg-emerald-400 hover:bg-emerald-600 focus:ring-4 focus:ring-blue-300 dark-mode:focus:ring-blue-900 cursor-pointer">
            {buttonName}
            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
