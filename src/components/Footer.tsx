export default function Footer() {
  return (
    <footer className="w-full py-6 bg-gradient-to-r from-[#0A2463] to-[#3E92CC]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <i className="fa-solid fa-robot text-xl text-white"></i>
            <span className="text-white font-medium">AI教学实训平台</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-white/70 text-sm">
          <p>© 2025 AI教学实训平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}