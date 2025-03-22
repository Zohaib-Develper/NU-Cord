import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-2 sm:mb-0">NU-Cord</div>
          <nav className="flex flex-wrap gap-4">
            <a href="#home" className="hover:text-gray-300">
              Home
            </a>
            <a href="#features" className="hover:text-gray-300">
              Features
            </a>
            <a href="#contact" className="hover:text-gray-300">
              Contact
            </a>
            <a href="#community" className="hover:text-gray-300">
              Community
            </a>
            <a href="#login" className="hover:text-gray-300">
              Login
            </a>
            <a href="#signup" className="hover:text-gray-300">
              Signup
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to NU-Cord
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Your FAST community; Just a Ping Away
          </p>
          <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            From coding chaos to chill convos, Nucord is your go-to space for
            everything whether it be projects, memes or post mid rants!
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Why NU-Cord?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Campus Communities
              </h3>
              <p className="text-sm sm:text-base">
                Join dedicated channels for your batch, courses & interests!
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Resource Sharing
              </h3>
              <p className="text-sm sm:text-base">
                Upload and access study materials, past papers, and lecture
                slides
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Study Rooms
              </h3>
              <p className="text-sm sm:text-base">
                Host group study sessions, share resources & ace your quizzes!
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Club & Society Channels
              </h3>
              <p className="text-sm sm:text-base">
                Stay updated with official clubs & societies at FAST—be it ACM,
                IEEE or SOFTEC
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Game Nights
              </h3>
              <p className="text-sm sm:text-base">
                Compete, chill, and vibe with fellow FASTians in gaming
                channels!
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                FAST Marketplace
              </h3>
              <p className="text-sm sm:text-base">
                Buy & sell books, gadgets, or even find freelance gigs
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Startup & Networking
              </h3>
              <p className="text-sm sm:text-base">
                Have a startup idea? Looking for teammates? Nucord got you
                covered
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Memes & Rant Space
              </h3>
              <p className="text-sm sm:text-base">
                Vent about surprise quizzes or share the latest FASTian meme
                trends!
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Internship & Job Alerts
              </h3>
              <p className="text-sm sm:text-base">
                Get exclusive internship and job opportunities tailored for FAST
                students
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="py-10 bg-gray-100 px-4">
        <div className="container mx-auto text-center">
          <p className="text-base sm:text-lg mb-4">Have Suggestions?</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Contact Our Team
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Join?
          </h2>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Join NU-Cord Now
          </button>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-10 px-4">
        <div className="container mx-auto text-center">
          <p className="text-base sm:text-lg max-w-2xl mx-auto">
            NU-Cord isn’t just a chat platform—it’s your digital campus
            experience designed to keep FASTians connected beyond classrooms
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <a href="#about" className="hover:text-gray-300">
              About
            </a>
            <a href="#features" className="hover:text-gray-300">
              Features
            </a>
            <a href="#faqs" className="hover:text-gray-300">
              FAQs
            </a>
            <a href="#contact" className="hover:text-gray-300">
              Contact Us
            </a>
            <a href="#privacy" className="hover:text-gray-300">
              Privacy Policy
            </a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">
              FB
            </a>
            <a href="#" className="hover:text-gray-300">
              TW
            </a>
            <a href="#" className="hover:text-gray-300">
              IG
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
