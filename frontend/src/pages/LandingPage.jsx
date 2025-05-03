import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const colors = ["#5e17eb", "#ffffff"];
  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prevColor) => {
        const nextIndex = (colors.indexOf(prevColor) + 1) % colors.length;
        return colors[nextIndex];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Campus Communities",
      description:
        "Join dedicated channels for your batch, courses & interests!",
    },
    {
      title: "Resource Sharing",
      description: "Share notes, slides, and other study materials with ease.",
    },
    {
      title: "Internship & Job Alerts",
      description:
        "Get Exclusive internship and job opportunities tailored for FAST students",
    },
    {
      title: "Club & Society Channels",
      description:
        "Stay Updated with official clubs & societies at FAST - be it ACM, IEEE or SOFTEC",
    },
    {
      title: "FAST Marketplace",
      description: "Buy and sell items within the FAST community conveniently.",
    },
    {
      title: "Memes & Rant Space",
      description:
        "Vent about surprise quizzes or share the latest FASTian meme trends",
    },
    {
      title: "Study Rooms",
      description:
        "Host Group study sessions, share resources & ace your quizzes!",
    },
    {
      title: "Game Nights",
      description:
        "Compete, chill, and vibe with fellow FASTians in gaming channels!",
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navbar />

      <section className="text-center py-12">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome to <span className="text-[#5e17eb] font-bold">NU-Cord</span>
        </h1>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Your FAST community,
          <br />
          <div className="mt-8">
            Just a{" "}
            <span className="font-bold" style={{ color: currentColor }}>
              {"Ping"}
            </span>{" "}
            Away
          </div>
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          From coding chaos to chill convos, NUcord is your go-to space for
          everything whether it be projects, memes or post mid rants
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#5e17eb] text-white text-lg font-medium py-3 px-6 rounded-xl shadow-md hover:opacity-80 transition cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="py-10 bg-white dark:bg-gray-800 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Why NU-Cord?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-5 bg-gray-200 dark:bg-gray-300 rounded-lg text-center shadow-md transform transition duration-300 hover:scale-105"
            >
              <p className="text-lg font-semibold text-black mb-2">
                {feature.title}
              </p>
              <p className="text-sm text-black">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-800 px-6 py-5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold mb-6 text-white transition duration-300 hover:text-[#5e17eb]">
            Have Suggestions?
          </h3>
          <a
            href="#contact"
            className="mt-6 inline-block bg-[#5e17eb] text-white text-lg font-medium py-3 px-6 rounded-xl shadow-md hover:opacity-80 transition"
          >
            Contact Our Team
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
