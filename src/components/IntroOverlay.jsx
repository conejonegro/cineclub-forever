"use client";

import { useState } from "react";

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black cursor-pointer"
    >
      <img
        src="/intro-overlay.svg"
        alt="Cineclub Forever Intro"
       className="w-full h-full object-contain"
      />
    </div>
  );
}
