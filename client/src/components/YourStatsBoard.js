import React, { useState } from "react";
import Leaderboard from "./Leaderboard";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Winners from "./Winners";
import ParticipantsCard from "./Partcipants";

const YourStatsBoard = ({
  userStats,
  totalVolume,
  tx,
  leaderdoardlist,
  getLeaderBoard,
  players,
  pastWinners,
}) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const [showWinners, setShowWinners] = useState(false);

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  const toggleWinners = () => {
    setShowWinners(!showWinners);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white p-6 rounded-md shadow-lg space-y-4 lg:space-y-0">
      {/* Leaderboard component on the left */}
      <div className="lg:w-1/2 p-1 rounded-md bg-blue-100">
        <h2 className="text-xl font-bold mb-4 text-center">LEADERBOARD</h2>
        <Leaderboard leaderboardlist={leaderdoardlist} getLeaderBoard={getLeaderBoard} />
      </div>

      {/* YourStatsBoard component on the right */}
      <div className="flex-1 lg:ml-8 p-4 rounded-md bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">STATS BOARD</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsItem("Wins", userStats.wins, "bg-blue-500")}
          {statsItem("Losses", userStats.losses, "bg-red-500")}
          {statsItem("Time Played", userStats.timePlayed, "bg-green-500")}
          {statsItem("Total Volume", `${totalVolume} Matic`, "bg-yellow-500")}
          {statsItem("Total Block TX", tx, "bg-purple-500")}
        </div>

        <div className="mt-4">
          <div className="text-center">
            <button onClick={toggleParticipants} className="text-blue-500 hover:underline">
              {showParticipants ? "Hide Participants" : "View current Participants"}
            </button>
            <button onClick={toggleWinners} className="ml-4 text-blue-500 hover:underline">
              {showWinners ? "Hide Winners" : "View Winners"}
            </button>
          </div>

          <div className="flex flex-wrap">
            {showParticipants && <ParticipantsCard players={players} />}
            {showWinners && <Winners pastWinners={pastWinners} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const statsItem = (title, value, bgColor) => (
  <div className={`rounded-full ${bgColor} p-6 flex items-center justify-center sm:mb-4`}>
    <div className="text-center">
      <p className="text-xl font-semibold mb-2 text-white">{title}</p>
      <p className="text-2xl">{value}</p>
    </div>
  </div>
);

export default YourStatsBoard;
