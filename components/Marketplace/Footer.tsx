import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  const phone = "+2348133012510"; // Replace with real WhatsApp number
  const waMsg = encodeURIComponent("Hi Bleefy! I need help with the marketplace.");
  const waHref = `https://wa.me/${phone}?text=${waMsg}`;

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-white">
            <Image src="/logo.png" alt="Bleefy" width={80} height={80} className="object-contain" />
          </div>
          <p className="text-sm leading-relaxed mb-5">
            Nigeria&apos;s most trusted agricultural marketplace — connecting farmers, buyers, and agri-educators through secure escrow-protected trade.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-500 transition-colors"
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat with Us on WhatsApp
          </a>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Platform</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
            <li><Link href="/learning" className="hover:text-white transition-colors">Learning Hub</Link></li>
            <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
            <li><Link href="/auth/signup" className="hover:text-white transition-colors">Start Selling</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer">About Bleefy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
            <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
            <li className="hover:text-white transition-colors cursor-pointer">Press</li>
          </ul>
        </div>

        {/* Legal + Support */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Support & Legal</h4>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
            <li className="hover:text-white transition-colors cursor-pointer">Buyer Protection</li>
            <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p>&copy; {new Date().getFullYear()} Bleefy Marketplace. All rights reserved.</p>

        </div>
      </div>
    </footer>
  )
}

export default Footer
