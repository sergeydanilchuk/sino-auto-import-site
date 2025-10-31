"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface VideoSectionProps {
  title?: string;
  description?: string;
  mainVideo: string;
  videos: string[];
}

export default function VideoSection({
  title = "Наши видео",
  description = "Смотрите обзоры, отзывы клиентов и процесс доставки автомобилей с аукционов Китая, Южной Кореи и Японии.",
  mainVideo,
  videos,
}: VideoSectionProps) {
  const [allVisible, setAllVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Следим за всей секцией, чтобы анимация запускалась синхронно
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAllVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="videos"
      ref={sectionRef}
      className="py-20 border-t border-border/40 bg-background"
    >
      <div className="container mx-auto px-12">
        {/* Заголовок */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={allVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-2 text-left"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={allVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground mb-12 text-left max-w-2xl"
          >
            {description}
          </motion.p>
        )}

        {/* Сетка видео */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Главное видео */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={allVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <LazyVKVideo
              src={mainVideo}
              className="rounded-2xl overflow-hidden shadow-md h-full"
              fullHeight
            />
          </motion.div>

          {/* Маленькие видео */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={allVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full"
          >
            {videos.map((url, index) => (
              <LazyVKVideo
                key={index}
                src={url}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ======================================
   Компонент LazyVKVideo с градиентным skeleton
====================================== */
function LazyVKVideo({
  src,
  className = "",
  fullHeight = false,
}: {
  src: string;
  className?: string;
  fullHeight?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        aspectRatio: "16 / 9",
        width: "100%",
        height: fullHeight ? "100%" : "auto",
        backgroundColor: "#000",
      }}
    >
      {!isLoaded ? (
        <div className="w-full h-full rounded-xl bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_1.5s_infinite]" />
          <style jsx>{`
            @keyframes shine {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
            div[style] > div {
              background-size: 200% 100%;
            }
          `}</style>
        </div>
      ) : (
        <iframe
          src={src}
          width="100%"
          height="100%"
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
