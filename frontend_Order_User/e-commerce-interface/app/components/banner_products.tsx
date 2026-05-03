"use client";

import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface HeroBannerProps {
  icon: LucideIcon;
  badge: string;
  headline: string;
  description: string;
  buttonText?: string;
  imageSrc: string;
  imageAlt: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HeroBanner({
  icon: Icon,
  badge,
  headline,
  description,
  buttonText = "Đặt ngay",
  imageSrc,
  imageAlt,
}: HeroBannerProps) {
  return (
    <section className="relative bg-[#0d0d0d] overflow-hidden rounded-none my-6 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-12 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* NỘI DUNG BÊN TRÁI */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 border border-white/5 rounded-none"
            >
              <Icon className="h-4 w-4 text-[#ff5528]" />
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">{badge}</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold text-white lg:text-4xl leading-tight"
            >
              {headline}
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-white/60 max-w-lg text-sm lg:text-base leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.div variants={itemVariants} className="pt-2">
              <Button 
                size="default" 
                className="bg-[#ff5528] hover:bg-orange-600 text-white font-bold px-6 py-5 rounded-none transition-all active:scale-95 flex items-center gap-2"
              >
                {buttonText}
                <ArrowRight size={16} />
              </Button>
            </motion.div>
          </motion.div>

          {/* HÌNH ẢNH BÊN PHẢI */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-video lg:aspect-auto lg:h-64 group"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover rounded-none transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}