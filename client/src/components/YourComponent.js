import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faUser ,faCoins} from "@fortawesome/free-solid-svg-icons";

const YourComponent = ({ balance, joinGame, address, players }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-md p-8 w-full sm:max-w-md">
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faCoins} className="text-3xl text-blue-600" />
          <h3 className="font-semibold text-lg sm:text-xl mt-2">Current Pool Balance</h3>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-3xl font-bold">{balance} MATIC</p>
          </div>
        </div>

        <button
          onClick={joinGame}
          disabled={!address}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 focus:outline-none transition-all text-sm sm:text-base w-full"
        >
          Join Pool
        </button>

        <div className=" bg-white  text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            <FontAwesomeIcon icon={faGamepad} className="mr-2" />
            {players.length} participants
          </h1>
         
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
