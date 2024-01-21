// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public manager;
    address[] public players;
    address[] public winners;


    mapping(address => Player) public Tplayer;
    address public winner;
    uint public prize;
    uint public constant amount = 0.1 ether;
    uint public TVolume;
    uint public TX;
    uint private commission;
    uint private  commissionvalue;
   
 
    struct Player {
        uint timeplayed;
        uint wins;
        uint losses;
        uint score;
    }

    // Add a new struct to represent leaderboard entry
struct LeaderboardEntry {
    address playerAddress;
    uint wins;
}

// Modify the leaderboard declaration
LeaderboardEntry[] public leaderboard;

// ...

// Modify the updateLeaderboard function
// Modify the updateLeaderboard function
function updateLeaderboard() internal {

    // Clear the leaderboard
    delete leaderboard;

    // Populate the leaderboard with all players
    for (uint i = 0; i < players.length; i++) {
        leaderboard.push(LeaderboardEntry({
            playerAddress: players[i],
            wins: Tplayer[players[i]].wins
        }));
    }

    // Sorting logic (bubble sort for simplicity)
    for (uint i = 0; i < leaderboard.length; i++) {
        for (uint j = 0; j < leaderboard.length - i - 1; j++) {
            if (leaderboard[j].wins < leaderboard[j + 1].wins) {
                // Use a temporary variable to perform the swap
                LeaderboardEntry memory temp = leaderboard[j];
                leaderboard[j] = leaderboard[j + 1];
                leaderboard[j + 1] = temp;
            }
        }
    }
}


// Modify the getLeaderboard function
function getLeaderboard() public view returns (LeaderboardEntry[] memory) {
    return leaderboard;
}


constructor(){
     manager =msg.sender;
}
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    modifier onlyWinner(){
        require(msg.sender == winner,"only winner can claim");
        _;
    }
   
    event WinnerPicked(address winner, uint256 prize);


    
function setcommission(uint _commission) onlyManager public {
commission = _commission;
}

function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function OwnerBalance() public view onlyManager returns(uint)  {

        return  manager.balance;
    }
    // function getTV() public view returns(uint){
    //     return TVolume;
    // }

    // function TXtimes() public view returns(uint){
    //     return TX;
    // }
//     function timesPlayed() public view returns(uint){
//         return Tplayer[msg.sender].timeplayed;
//     }
//   function timesWon() public view returns(uint){
//         return Tplayer[msg.sender].wins;
//     }





     function getPlayerStats(address player) public view returns (uint wins, uint losses, uint timePlayed) {
        Player storage playerInfo = Tplayer[player];
        return (playerInfo.wins, playerInfo.losses, playerInfo.timeplayed);
    }

// function timesLost() public view returns(uint){
//         return Tplayer[msg.sender].losses;
//     }

    function joinGame() external payable  {
        require(msg.value == amount, "Incorrect ether value sent");
        require(players.length < 100, "Maximum number of players reached");
  for (uint256 i = 0; i < players.length; i++) {
            require(players[i] != msg.sender, "You are already a participant in the game.");
        }
        players.push(msg.sender);
         TVolume += msg.value;
        TX++;
        Player storage newPlayer = Tplayer[msg.sender];
        newPlayer.timeplayed++;
    }

    function pickWinner() public onlyManager {
        require(players.length >= 3, "This lottery needs more than 3 players");

        uint index = random() % players.length;
         winner = players[index];

        Tplayer[winner].wins++;
        TX++;

        for (uint i = 0; i < players.length; i++) {
            if (i != index) {
                Tplayer[players[i]].losses++;
            }
        }

        prize = address(this).balance;
        winners.push(winner);
        updateLeaderboard();
        emit WinnerPicked(winner, prize);

        // Reset the game
        resetGame();
    }

    function transferPrize() public payable onlyWinner {
        require(prize > 0, "No prize to transfer");
        require(commission > 0, "zero platform fees");
         TVolume+=prize;
         commissionvalue = (prize * commission) / 100;
         uint actualprize = prize - commissionvalue;

        payable(winners[winners.length - 1]).transfer(actualprize);
       
        TX++;
        prize = 0; // Reset prize after transfer
        payable(manager).transfer(commissionvalue);
        
    }

function viewPlayers() public view returns (address[] memory) {
        return players;
    }
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, players)));
    }

    function resetGame() private {
        delete players;
    }

    function getWinCount(address player) public view returns (uint) {
        return Tplayer[player].wins;
    }

    function viewPastWinners() public view returns (address[] memory) {
        return winners;
    }
}
