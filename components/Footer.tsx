import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
     <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-xl font-bold">Bleefy</span>
            </div>
            <p className="text-sm">Empowering farmers worldwide with technology and community.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li /* onClick={() => handleNavClick('marketplace')}  */className="cursor-pointer hover:text-white"><Link href="marketplace" >Marketplace</Link></li>
              <li /* onClick={() => handleNavClick('community')}  */className="cursor-pointer hover:text-white"><Link href={"marketplace"}></Link>community</li>
              <li /* onClick={() => handleNavClick('learning')} */ className="cursor-pointer hover:text-white"><Link href={"learning"}>Learning</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press</li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4">Legal</h4>
             <ul className="space-y-2 text-sm">
               <li className="hover:text-white cursor-pointer">Privacy Policy</li>
               <li className="hover:text-white cursor-pointer">Terms of Service</li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-sm border-t border-gray-800 pt-8">
          <p>&copy; 2024 AgriMarket Platform. All rights reserved.</p>
        </div>
      </footer>
  )
}

export default Footer