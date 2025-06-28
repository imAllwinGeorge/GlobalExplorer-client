
import { Facebook, Instagram, Youtube } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left Section - Brand and Copyright */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">GlobalExplorer</h2>
            <p className="text-sm text-gray-300">© 2024 justicehub . All rights reserved.</p>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="space-y-3">
            <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
              Services
            </Link>
            <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
              Providers
            </Link>
            <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Right Section - Legal Links and Social Icons */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Terms and conditions
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link
                to="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
