import React, { useEffect } from "react";
import "../style/fallingStars.css";

const FallingStars = () => {
  useEffect(() => {
    const starsContainer = document.querySelector(".stars-container");

    function createStar() {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = `${Math.random() * 100}vw`; // Random horizontal position
      star.style.animationDuration = `${2 + Math.random() * 2.5}s`; // Varying speed
      star.style.backgroundColor = ["#fff", "#ffeb99", "#add8e6"][Math.floor(Math.random() * 3)]; // White, Yellow, Light Blue

      starsContainer.appendChild(star);

      setTimeout(() => {
        star.remove(); // Remove stars after animation
      }, 5000);
    }

    const interval = setInterval(createStar, 200); // Create stars every 200ms

    return () => clearInterval(interval);
  }, []);

  return <div className="stars-container"></div>;
};

export default FallingStars;
