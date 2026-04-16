import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="w-full py-3 px-6 bg-gradient-to-r from-[#0A2463] to-[#3E92CC] shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center space-x-3 group"
        >
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.3 }}
            className="p-2 bg-white/10 rounded-full backdrop-blur-sm"
          >
            <i className="fa-solid fa-robot text-2xl text-white"></i>
          </motion.div>
          <motion.span 
            className="text-xl font-bold text-white"
            whileHover={{ scale: 1.05 }}
          >
            AI教学平台
          </motion.span>
        </motion.div>
      </div>
    </nav>
  );
}