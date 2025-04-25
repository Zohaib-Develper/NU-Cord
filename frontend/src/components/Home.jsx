import FriendsImage from "../assets/friends.png";

const Landing = () => {
  return (
    <div className="w-280 bg-gray-800 text-white h-screen p-2 flex flex-col items-center justify-center">
      <div className="space-y-4 flex flex-col items-center w-full ">
        <div className="p-2 w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer ">
          <h3 className="text-lg font-semibold">Invite your friends</h3>
        </div>
        <div className="p-2 w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer">
          <h3 className="text-lg font-semibold">
            Say Hi to your class fellows
          </h3>
        </div>
        <div className="p-2 w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer">
          <h3 className="text-lg font-semibold">
            Study together for your exams
          </h3>
        </div>
      </div>

      <div className="flex items-center mt-10 gap-30">
        <img
          src={FriendsImage}
          alt="Chatting"
          className="w-80 rounded-lg mb-4"
        />
        <h2 className="text-8xl font-bold text-center">
          Happy <br />
          Chatting!
        </h2>
      </div>
    </div>
  );
};
export default Landing;
