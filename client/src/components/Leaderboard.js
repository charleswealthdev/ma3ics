import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faSearch } from "@fortawesome/free-solid-svg-icons";


const Leaderboard = ({ leaderboardlist,getLeaderBoard }) => {
    // yyy
  useEffect(()=>{
    getLeaderBoard()
  })
    const [searchInput, setSearchInput] = useState("");
  
    const filteredLeaderboard = leaderboardlist.filter(entry =>
      entry.playerAddress.toLowerCase().includes(searchInput.toLowerCase())
    );
  
    return (
     
        <div className=" bg-white flex flex-col items-center justify-center">
      <div className="max-w-screen-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold flex items-center mb-4">
          <span className="mr-2">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
          </span>
          Leaderboard
        </h2>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search Address"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 flex-1"
          />
          <span className="text-gray-500">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">S/N</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Wins</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b font-bold">
                  <span className="mr-2">
                    <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
                  </span>
                  {entry.playerAddress.substr(0, 8)}...
                </td>
                <td className="py-2 px-4 border-b font-bold">{entry.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
  };
  
  export default Leaderboard;
  