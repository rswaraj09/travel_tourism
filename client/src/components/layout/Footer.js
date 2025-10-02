import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlane, 
  FaHotel, 
  FaRoute, 
  FaTrain, 
  FaBus,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-100">
          {/* Brand and Social */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaPlane className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold">TravelTourism</span>
            </div>
            <p className="mb-4">Your trusted partner for all travel needs. Book flights, hotels, packages, and more with ease.</p>
            <div className="flex space-x-4">
              {/* <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a> */}
              <a href="https://www.linkedin.com/in/ramsha-nigar-82066a258/" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          {/* Support */}
          {/* <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div> */}

          {/* Empty columns for spacing if needed */}
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>

          {/* Contact Info - right aligned on desktop */}
          <div className="md:col-span-1 md:text-right">
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li><FaPhone className="inline mr-2" /> +91 9341381675 </li>
              <li><FaEnvelope className="inline mr-2" /> ramshanigar@traveltourism.com</li>
              <li><FaMapMarkerAlt className="inline mr-2" /> Digha Ghat , Patna, Bihar,India (800011)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm">
          © 2024 TravelTourism. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
            Privacy
          </Link>
          <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 