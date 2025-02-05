import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import '../css/infoSec.css'
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const images = [
  "https://res.cloudinary.com/dldrjl92a/image/upload/v1738607987/4_hxxzyr.svg",
  "https://res.cloudinary.com/dldrjl92a/image/upload/v1738607988/1_jhybr7.svg",
  "https://res.cloudinary.com/dldrjl92a/image/upload/v1738607988/2_bxobta.svg",
  "https://res.cloudinary.com/dldrjl92a/image/upload/v1738607988/3_kaabt9.svg",
  "https://res.cloudinary.com/dldrjl92a/image/upload/v1738434897/IMG_7830_11zon_kxwsip.jpg"
]

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 8000) 

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="relative w-full h-[350px] overflow-hidden rounded-xl">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="absolute top-0 left-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-1 rounded-2xl transition-all ${currentIndex === index ? "w-8 bg-white" : "w-4 bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export function InfoSection() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 z-10 p-2 md:p-6 ">
      <motion.div variants={item} className="space-y-4">
        <h1 className="title  text-4xl bg-clip-text text-center text-transparent bg-gradient-to-r from-[#0abfba] to-[#4879e2]">
          Walchand linux users' group
        </h1>
       
      </motion.div>

      <motion.div variants={item} className="pt-8 border-t border-[#4879e2] ">
      <motion.div variants={item} className="space-y-4">
        <h1 className="title text-4xl pb-5 bg-clip-text text-center text-transparent bg-[#4879e2]">
         memories
        </h1>
       
      </motion.div>
        <Carousel />
      </motion.div>

    </motion.div>
  )
}

