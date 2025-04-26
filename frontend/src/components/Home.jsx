import FriendsImage from "../assets/friends.png";

const Landing = () => {
  return (
    <div className="w-full bg-gray-800 text-white min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="space-y-4 flex flex-col items-center w-full max-w-2xl">
        <div className="p-3 w-full md:w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer transition-opacity">
          <h3 className="text-base md:text-lg font-semibold">Invite your friends</h3>
        </div>
        <div className="p-3 w-full md:w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer transition-opacity">
          <h3 className="text-base md:text-lg font-semibold">
            Say Hi to your class fellows
          </h3>
        </div>
        <div className="p-3 w-full md:w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer transition-opacity">
          <h3 className="text-base md:text-lg font-semibold">
            Study together for your exams
          </h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:mt-16 gap-8 md:gap-16">
        <img
          src={FriendsImage}
          alt="Chatting"
          className="w-64 md:w-80 rounded-lg"
        />
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center">
          Happy <br />
          Chatting!
        </h2>
      </div>
    </div>
  );
};
export default Landing;
