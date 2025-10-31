"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // 🌀 иконка загрузки из shadcn/ui

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (!window.ymaps) return;

      window.ymaps.ready(() => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) return;

        const map = new window.ymaps.Map(mapContainer, {
          center: [43.322754, 132.087588],
          zoom: 15,
          controls: ["zoomControl", "fullscreenControl"],
        });

        const placemark = new window.ymaps.Placemark(
          [43.322754, 132.087588],
          {
            hintContent: "Sino Auto Import",
            balloonContent: "Шоссейный переулок, 2, Артём, Приморский край",
          },
          {
            preset: "islands#redAutoIcon",
          }
        );

        map.geoObjects.add(placemark);
        setIsLoaded(true); // ✅ когда карта полностью инициализирована
      });
    };

    // Проверяем, подключён ли уже скрипт
    if (document.getElementById("yandex-maps-script")) {
      if (window.ymaps) initMap();
      return;
    }

    const script = document.createElement("script");
    script.id = "yandex-maps-script";
    script.src =
      "https://api-maps.yandex.ru/2.1/?apikey=f0036356-1386-4880-b59c-9eac9424e045&lang=ru_RU";
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#1e1e1e", // 👌 мягкий фон до загрузки
      }}
    >
      {/* Контейнер карты */}
      <div
        id="map"
        style={{
          width: "100%",
          height: "100%",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* 🌀 Лоадер (в стиле shadcn/ui) */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            color: "#ccc",
          }}
        >
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Загрузка карты...</p>
        </div>
      )}
    </div>
  );
}
