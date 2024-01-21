import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ParticipantsCard = ({ players }) => {
  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-md overflow-hidden shadow-lg">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
        current Participants ({players.length})
        </h1>
        {players.length === 0 ? (
          <p className="text-gray-500 text-center">No participants yet.</p>
        ) : (
          <div className="space-y-4">
            {players.map((player, index) => (
              <div
                key={index}
                className="bg-blue-50 p-3 rounded-md shadow-md transition-all hover:shadow-lg"
              >
                <p className="text-md font-semibold text-blue-600">{player}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsCard;
