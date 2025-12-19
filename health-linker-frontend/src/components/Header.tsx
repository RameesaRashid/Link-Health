import React from "react";
import { motion, type Variants } from "framer-motion";

const Header: React.FC = () => {
  const title = "LINK HEALTH";

  
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: -100,
      transition: { duration: 0.3, ease: "easeInOut" } 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        duration: 0.5,
        ease: "easeOut"
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden" 
      className="w-full h-30 bg-gradient-to-b from-blue-50/50 to-white/80 backdrop-blur-lg border-b border-blue-100 flex flex-col justify-center items-center sticky top-0 z-30 shadow-sm"
    >
      <div className="flex flex-col items-center gap-1">
        <motion.div className="flex items-center gap-3">
          <h1 className="text-3xl font-black flex overflow-hidden">
            {title.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className={index > 3 ? "text-green-500" : "text-blue-900"}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="w-1.5 h-1.5 mb-3 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="px-3 py-0.5 bg-blue-900 rounded-xl shadow-lg"
        >
          <span className="text-[9px] text-white font-bold tracking-[0.4em] uppercase">
            Advanced Healthcare Management
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;