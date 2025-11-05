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
      <div className="container mx-auto px-4 sm:px-12">
        {/* Заголовок */}
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Сетка видео */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Главное видео */}
          <div className="w-full h-full">
            <LazyVKVideo
              src={mainVideo}
              className="rounded-2xl overflow-hidden shadow-md h-full"
              fullHeight
            />
          </div>

          {/* Маленькие видео - на мобильных горизонтальный скролл */}
          <div className="h-full">
            {/* Десктопная версия */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-6 h-full">
              {videos.map((url, index) => (
                <LazyVKVideo
                  key={index}
                  src={url}
                  className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                />
              ))}
            </div>

            {/* Мобильная версия с горизонтальным скроллом */}
            <div className="sm:hidden">
              <HorizontalVideoScroll videos={videos} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================================
   Горизонтальный скролл для мобильных
====================================== */
function HorizontalVideoScroll({ videos }: { videos: string[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {videos.map((url, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[85vw] max-w-[320px]"
            style={{
              scrollSnapAlign: 'start',
            }}
          >
            <LazyVKVideo
              src={url}
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            />
          </div>
        ))}
      </div>

      {/* Индикатор скролла */}
      <div className="flex justify-center mt-4 gap-1">
        {videos.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-muted-foreground/30"
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
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