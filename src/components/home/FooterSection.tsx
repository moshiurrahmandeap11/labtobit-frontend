import { RevealText } from '@/components/shared/RevealText';

export const FooterSection = () => {
  return (
    <footer className="w-full bg-[#0b100d] text-white pt-20 pb-10 px-6 sm:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col">

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-800 pt-12">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-zinc-500 font-mono text-xs tracking-widest uppercase"><RevealText>Contact</RevealText></h4>
            <a href="mailto:hello@labtobit.com" className="text-xl sm:text-2xl font-bold hover:text-cyan-400 transition-colors">
              hello@labtobit.com
            </a>
            <p className="text-zinc-400 text-sm">
              +880 1234 567890
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-zinc-500 font-mono text-xs tracking-widest uppercase"><RevealText>Socials</RevealText></h4>
            <div className="flex flex-col gap-2">
              {['Twitter', 'LinkedIn', 'Instagram', 'Dribbble'].map((social) => (
                <a key={social} href="#" className="text-base font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-zinc-500 font-mono text-xs tracking-widest uppercase"><RevealText>Location</RevealText></h4>
            <p className="text-base font-medium leading-relaxed">
              123 Creative Street<br/>
              Tech Valley, Block C<br/>
              Dhaka, Bangladesh
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-zinc-600 text-xs font-mono tracking-widest uppercase">
          <p>© {new Date().getFullYear()} LABTOBIT. ALL RIGHTS RESERVED.</p>
          <p className="mt-4 sm:mt-0">MADE WITH PASSION</p>
        </div>
      </div>
    </footer>
  );
};
