// AdminPage.js
import React from "react";

const AdminPage = ({ pickWinner, setcommission, isOwner }) => {
  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-md overflow-hidden shadow-lg">
      <div className="p-6">
        {isOwner ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={pickWinner}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
              >
                Pick Winner
              </button>
              <button
                onClick={setcommission}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-green active:bg-green-800"
              >
                Set Commission
              </button>
            </div>
          </>
        ) : (
          <div className="text-red-500 mt-4">
            <p>You do not have permission to access this page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
