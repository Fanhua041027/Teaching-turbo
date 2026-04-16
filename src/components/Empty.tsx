import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Empty component
export function Empty() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("flex flex-col h-full items-center justify-center p-8 text-center")}
      onClick={() => toast('功能即将上线')}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-6 bg-gradient-to-br from-[#3E92CC]/10 to-[#0A2463]/10 rounded-full mb-6"
      >
        <i className="fa-solid fa-box-open text-5xl text-[#3E92CC]"></i>
      </motion.div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">功能开发中</h3>
      <p className="text-gray-500 max-w-md leading-relaxed">
        我们的工程师正在努力开发此功能，请稍后再来查看。
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 px-6 py-2 bg-[#3E92CC] text-white rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        通知我
      </motion.button>
    </motion.div>
  );
}