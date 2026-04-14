import React, { useState, useEffect } from "react";

const typeWritterData = [
  "Going home for Summer Holidays?",
  "Booking a cab to airport or station?",
  "Looking to split up the fare?",
];

const TYPING_SPEED = 100;
const ERASING_SPEED = 30;
const DELAY_BEFORE_ERASE = 2000;
const DELAY_BEFORE_TYPE = 500;

function Typewriter() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = typeWritterData[index];
    let timer;

    if (!isDeleting && text.length < current.length) {
      timer = setTimeout(
        () => setText(current.slice(0, text.length + 1)),
        TYPING_SPEED,
      );
    } else if (!isDeleting && text.length === current.length) {
      timer = setTimeout(() => setIsDeleting(true), DELAY_BEFORE_ERASE);
    } else if (isDeleting && text.length > 0) {
      timer = setTimeout(
        () => setText(current.slice(0, text.length - 1)),
        ERASING_SPEED,
      );
    } else if (isDeleting && text.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % typeWritterData.length);
      }, DELAY_BEFORE_TYPE);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <div className="w-full max-w-full text-left noto-serif-typeWritter font-extrabold text-cyan-400">
      {/* larger screens */}
      <div className="hidden md:block w-full text-2xl lg:text-4xl xl:text-5xl whitespace-nowrap overflow-visible h-8 mb-12 lg:h-10 xl:h-12">
        {text}
        <span className="text-gray-200 animate-blink pl-1">|</span>
      </div>

      {/*  mobile screens */}
      <div className="md:hidden w-full mt-30 text-3xl sm:text-2xl whitespace-normal break-words leading-tight min-h-[5rem]">
        <span className="inline">
          {text}
          <span className="text-gray-200 animate-blink pl-1">|</span>
        </span>
      </div>
    </div>
  );
}

export default Typewriter;
