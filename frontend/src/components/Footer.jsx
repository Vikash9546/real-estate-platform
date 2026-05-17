import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCallbackClick = (e) => {
    e.preventDefault();
    alert("Callback request submitted! Our specialist will reach out to you within 10 minutes. 📞");
  };

  return (
    <footer className="bg-[#1E140F] text-[#FAF8F5] pt-20 pb-10 border-t border-[#E6C594]/20 relative overflow-hidden">
      
      {/* Subtle warm glow background element */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-[#E6C594]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Logo & Description */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col items-start cursor-pointer" onClick={handleScrollToTop}>
              <span className="text-2xl font-serif font-light tracking-[0.25em] uppercase leading-none text-white">
                FORMA
              </span>
              <span className="text-[8px] font-sans font-bold tracking-[0.55em] text-[#E6C594] uppercase mt-1.5 leading-none pl-[2px]">
                — STAIRS —
              </span>
            </div>
            <p className="text-[#A6978E] text-xs leading-relaxed max-w-xs font-light">
              Manufacturing of premium staircases for residential and commercial interiors. Custom tailor-made approaches from initial concept to final assembly.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center text-[#A6978E] hover:text-[#E6C594] hover:border-[#E6C594] transition-all duration-300 text-xs">
                vk
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center text-[#A6978E] hover:text-[#E6C594] hover:border-[#E6C594] transition-all duration-300 text-xs">
                tg
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center text-[#A6978E] hover:text-[#E6C594] hover:border-[#E6C594] transition-all duration-300 text-xs">
                yt
              </a>
            </div>
          </div>

          {/* Links 1: Catalog */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-serif text-[18px] tracking-wide mb-6">Catalog</h3>
            <ul className="space-y-3">
              <li><Link to="/#catalog" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Straight Stairs</Link></li>
              <li><Link to="/#catalog" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Spiral Stairs</Link></li>
              <li><Link to="/#catalog" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Mono-Stringer Stairs</Link></li>
              <li><Link to="/#catalog" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Floating Stairs</Link></li>
              <li><Link to="/#catalog" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Combined Designs</Link></li>
            </ul>
          </div>

          {/* Links 2: Buyers */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-serif text-[18px] tracking-wide mb-6">Buyers</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Bespoke Projects</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Materials & Finishes</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Delivery & Assembly</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Warranty terms</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">FAQs & Help</a></li>
            </ul>
          </div>

          {/* Links 3: Company */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-serif text-[18px] tracking-wide mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">About Us</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Manufacturing</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Our Portfolio</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Journal</a></li>
              <li><a href="#" className="text-[#A6978E] hover:text-[#E6C594] transition-colors text-xs font-light">Contacts</a></li>
            </ul>
          </div>

          {/* Contacts & Callback */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-white font-serif text-[18px] tracking-wide mb-6">Contacts</h3>
            <div className="space-y-4">
              <div>
                <a href="tel:+74951204567" className="text-lg font-semibold text-white hover:text-[#E6C594] transition-colors">
                  +7 (495) 120-45-67
                </a>
              </div>
              <div>
                <a href="mailto:info@formastairs.ru" className="text-xs text-[#A6978E] hover:text-[#E6C594] transition-colors">
                  info@formastairs.ru
                </a>
              </div>
              <div className="text-xs text-[#A6978E] leading-relaxed font-light">
                15 Stroiteley St, Moscow <br />
                Workshop and Showroom
              </div>
              
              <button
                onClick={handleCallbackClick}
                className="w-full text-center border border-[#E6C594]/40 hover:border-[#E6C594] hover:bg-[#FAF8F5] text-white hover:text-[#1E140F] rounded-full py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 mt-2"
              >
                Order Callback
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FAF8F5]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#A6978E] font-light">
          <p>
            &copy; {new Date().getFullYear()} FORMA STAIRS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
