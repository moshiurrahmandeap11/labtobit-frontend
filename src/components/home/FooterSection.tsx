"use client";
import { motion } from "framer-motion";

export const FooterSection = () => {
  return (
    <footer className="w-full bg-zinc-950 text-white pt-[20vh] pb-[5vh] px-4 sm:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Massive Call to Action */}
        <div className="flex flex-col mb-[15vh]">
          <h2 className="text-[12vw] font-black uppercase leading-[0.8] tracking-tighter hover:text-transparent hover:[-webkit-text-stroke:2px_white] transition-all duration-500 cursor-pointer">
            LET'S
          </h2>
          <h2 className="text-[12vw] font-black uppercase leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:2px_white] hover:text-white transition-all duration-500 cursor-pointer ml-[10vw]">
            TALK
          </h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-800 pt-12">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Contact</h4>
            <a href="mailto:hello@labtobit.com" className="text-2xl font-bold hover:text-cyan-400 transition-colors">
              hello@labtobit.com
            </a>
            <p className="text-zinc-400 text-sm">
              +880 1234 567890
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Socials</h4>
            <div className="flex flex-col gap-2">
              {['Twitter', 'LinkedIn', 'Instagram', 'Dribbble'].map((social) => (
                <a key={social} href="#" className="text-lg font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Location</h4>
            <p className="text-lg font-medium leading-relaxed">
              123 Creative Street<br/>
              Tech Valley, Block C<br/>
              Dhaka, Bangladesh
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-[15vh] flex flex-col sm:flex-row justify-between items-center text-zinc-600 text-xs font-mono tracking-widest uppercase">
          <p>© {new Date().getFullYear()} LABTOBIT. ALL RIGHTS RESERVED.</p>
          <p className="mt-4 sm:mt-0">MADE WITH PASSION</p>
        </div>
      </div>

      {/* Abstract Footer Glow */}
      <div className="absolute bottom-[-50%] left-[50%] -translate-x-1/2 w-[100vw] h-[100vw] rounded-full blur-[150px] opacity-10 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 70%)',
        }}
      />
    </footer>
  );
};
