import Web3 from 'web3';
import { useState, useEffect,useRef } from 'react';
import Lottery from '../contracts/Lottery.json';

import polygonLogo from "../images/polygon-logo.png";
import AdminPage from './Adminpage';
import { isAddress } from 'web3-validator';

import YourStatsBoard from './YourStatsBoard';
import YourComponent from './YourComponent';
import TaskZone from './Taskzone';
function Home() {

    const [state, setState] = useState({ web3: null, contract: null });
    const [web3,setWeb3] = useState()
    const [address, setAddress] = useState();
    const [players, setPlayers] = useState([]);
    const [leaderboardlist,setLeaderboard] = useState([])
    const [balance, setBalance] = useState();
    const [winner, setWinnerAddress] = useState('');
    const [prize, setWinnerPrize] = useState('');
    const [isOwner,setIsOwner] = useState(false);
    const [owner,setOwner] = useState("0x346507Ba876a2Ac1b5174D5e296193f201a343AC")
    const [pastWinners, setPastWinners] = useState([]);
    const sliderRef = useRef(null);
    const [tx,setTX]= useState(0);
    const [totalVolume,setTV] = useState(0);
    const [userStats, setUserStats] = useState({
      wins: 0,
      losses: 0,
      timePlayed: 0,
    });


  const [showPoolZone, setShowPoolZone] = useState(true);
  const [showStatsZone, setShowStatsZone] = useState(false);
  const [showTaskZone, setShowTaskZone] = useState(false);

  const togglePoolZone = () => {
    setShowPoolZone(true);
    setShowStatsZone(false);
    setShowTaskZone(false);
  };

  const toggleStatsZone = () => {
    setShowPoolZone(false);
    setShowStatsZone(true);
    setShowTaskZone(false);
  };

  const toggleTaskZone = () => {
    setShowPoolZone(false);
    setShowStatsZone(false);
    setShowTaskZone(true);
  };
  
    useEffect(()=> {
const storedWinner = localStorage.getItem('winner')
if (storedWinner) setWinnerAddress(storedWinner);
    })
  

  
    useEffect(() => {
      // const provider = new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/");
      const provider = new Web3(window.ethereum)
      async function connectToContract() {
        try {
          const web3 = new Web3(provider);
          const networkId = await web3.eth.net.getId();
          console.log(networkId);
          const deployedNetwork = Lottery.networks;
          const deployedId = deployedNetwork[networkId];
          console.log(deployedNetwork,deployedId)
    // console.log(deployedId.address, " 0x64D6cC4305f1B3a361228bEf9667F6f9919547ef")
          if (deployedId) {
            const contract = new web3.eth.Contract(Lottery.abi, deployedId.address);
            // console.log(contract)
            setState({ web3, contract });
          } else {
            console.error("Contract not deployed on the specified network.");
          }
        } catch (error) {
          console.error("Error connecting to the contract:", error);
        }
      }
  
      // Ensure provider is available before attempting to connect
      if (provider) {
        connectToContract();
      } else {
        console.error("Web3 provider not available.");
      }
    }, []);
    
  
  
   
    const connectWallet = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.getAccounts();
          const userAddress = accounts[0];
  
          localStorage.setItem('walletAddress', userAddress);
  
          setWeb3(web3Instance);
          setAddress(userAddress);
          setState({ web3: web3Instance, contract: state.contract, address: userAddress });
  
          if (userAddress === owner) {
            setIsOwner(true);
            // console.log(isOwner)
          }
        } catch (err) {
          console.error(err.message);
        }
      } else {
        setAddress('');
        console.log('Please install MetaMask');
      }
    };
  
    const disconnectWallet = () => {
      localStorage.removeItem('walletAddress');
  
      setWeb3(null);
      setAddress('');
      setIsOwner(false);
      setState({ web3: null, contract: state.contract, address: '' });
    };
  
    useEffect(() => {
      const storedAddress = localStorage.getItem('walletAddress');
    
      if (typeof window.ethereum !== 'undefined' &&  storedAddress && isAddress(storedAddress)) {
        setAddress(storedAddress);
    
    
        const handleAccountsChanged = (accounts) => {
          if (accounts.length > 0) {
            const userAddress = accounts[0];
            setAddress(userAddress);
    
            if (userAddress === '0x346507Ba876a2Ac1b5174D5e296193f201a343AC') {
              setIsOwner(true);
            } else {
              setIsOwner(false);
            }
          } else {
            setAddress('');
            setIsOwner(false);
          }
        };

        const handleConnectWallet  = ()=>{
          connectWallet()
        }
    
        const handleDisconnect = () => {
    localStorage.removeItem("walletAddress")
          setAddress('');
          setIsOwner(false);
          setState({ web3: null, contract: state.contract, address: '' });
        };
    
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    
        // Listen for disconnect
        window.ethereum.on('disconnect', handleDisconnect);
        window.ethereum.on('connect', handleConnectWallet);
    
        return () => {
          // Remove event listeners on component unmount
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
          window.ethereum.removeListener('connect', handleConnectWallet);
        };
      } else {
        // Handle the case where the stored address is not valid (optional)
        console.warn('Invalid or missing wallet address in localStorage.');
      }
    }, []); // Include web3.utils as a dependency if it's not recognized by ESLint
    
   
   useEffect(()=>{
  
    const fetchData =async () =>{
    if(state.contract){
    
     await getPlayers()
    await getBalance()
     await viewPastWinners()

      }
  
    }
    fetchData();   
   },[state.contract,balance,players,pastWinners])
  
   
  
    const getPlayers = async () => {
      try {
        const players = await state.contract.methods.viewPlayers().call();
        setPlayers(players);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }
  
    const getBalance = async () => {
    const { contract, web3 } = state;
    const balances = await contract.methods.getBalance().call();
    setBalance(Web3.utils.fromWei(balances, 'ether'));
  }
  
  
  
    const viewPastWinners = async () => {
      try {
        const pastWinners = await state.contract.methods.viewPastWinners().call();
        setPastWinners(pastWinners);
      } catch (error) {
        console.error('Error fetching past winners:', error);
      }
    }
  
    
    useEffect(()=>{
  
    const fetchGameStats = async ()=>{
  if(state.contract){
 await userstats()
 await  getTVolume()
 await getTX()

  }

  else {
    return "you are not connected";
  }
    }
    fetchGameStats()
  },[state.contract,tx,totalVolume,userStats])
  
    const userstats = async ()=>{
      const stats = await state.contract.methods.getPlayerStats(address).call();
      setUserStats({
        wins: parseInt(stats[0], 10),
        losses: parseInt(stats[1], 10),
        timePlayed: parseInt(stats[2], 10),
      });
    }

    const getLeaderBoard = async () => {
      try {
          const leaderboardEntry = await state.contract.methods.getLeaderboard().call();
          const formattedLeaderboard = leaderboardEntry.map(entry => ({
              playerAddress: entry[0],
              wins: parseInt(entry[1], 10),
          }));
          setLeaderboard(formattedLeaderboard);
           console.log(leaderboardlist,formattedLeaderboard) 
      } catch (error) {
          console.error("Error fetching leaderboard:", error);
      }
  };
  
    const getTVolume = async () => {
      try{
        const ToVolume = await state.contract.methods.TVolume().call();
        setTV(Web3.utils.fromWei(parseInt(ToVolume, 10), 'ether'));  }
        catch(error) {
          console.error("error",error)
        }  
    }
  
    const getTX = async () => {
      try {
        const TX = await state.contract.methods.TX().call();
        setTX(parseInt(TX, 10));
    }
    catch(error){
      console.error("Error",error)
    }
    }
    const joinGame = async () => {
      const { contract, web3 } = state;
      try {
        if (contract) {
          await contract.methods.joinGame().send({
            from: address,
            value: web3.utils.toWei("0.1", "ether"),
            gas: 200000, // Adjust gas limit
          });
  
         
        } else {
          console.error('Contract not initialized. Make sure it is deployed and available.');
        }
      } catch (err) {
        console.error('Error joining game:', err.message);
      }
  
      getBalance();
      getPlayers();
     getTVolume();
      getTX();
      userstats()
      // fetchData();
      // fetchGameStats();
    };
  
    const pickWinner = async () => {
      try {
        if (state.contract) {
          const pickWinnerTx = await state.contract.methods.pickWinner().send({
            from: address,
            gas: 5000000,
          });
  
  
          const winnerEvent = pickWinnerTx.events.WinnerPicked;
          if (winnerEvent) {
            setWinnerAddress(winnerEvent.returnValues.winner);
            setWinnerPrize(Web3.utils.fromWei(winnerEvent.returnValues.prize, 'ether'));
            localStorage.setItem("winner",winnerEvent.returnValues.winner);
            return winnerEvent.returnValues.winner;
          }
        }
      } catch (error) {
        console.error('Error picking winner:', error);
      }
      getBalance();
      getPlayers();
      getTVolume();
      getTX();
      userstats()
      // fetchData();
      // fetchGameStats()
    };
const setcommission = async () => {
  try {
    const hello = await state.contract.methods.setcommission(5).send({ from: address });
     return 
  } catch (error) {
    console.error('Error setting commission:', error);
  }
}  

const ownerbalance = async () => {
  try {
   const ownerbal= await state.contract.methods.OwnerBalance().call({from:address });
  console.log(parseInt(ownerbal))
  } catch (error) {
    console.error('Error checking balance:', error);
  }
}  
    const claimPrize = async () => {
      try {
        await state.contract.methods.transferPrize().send({ from: address });
        setWinnerAddress(null);
        setWinnerPrize(0);
        localStorage.removeItem("winner")
      } catch (error) {
        console.error('Error claiming prize:', error);
      }
  
      getBalance();
      getPlayers();
      getTVolume();
      getTX();
      userstats()
  
      window.location.reload();
    };
  
   
  

return(
  
<div className="App min-h-screen bg-white">

      <div className="bg-white  rounded shadow-md ">
  
 <div> <button
    onClick={address ? disconnectWallet : connectWallet}
    className="bg-yellow-400 text-white px-1 py-2 rounded-full hover:bg-yellow-600 focus:outline-none transition-all"
  >
    {address ? 'Disconnect Wallet' : 'Connect Wallet'}
  </button>
  {address && (
    <p className="ml-1 text-gray-600">
      Connected to: {address.length > 10 ? `${address.slice(0, 10)}...` : address}
    </p>
  )}
  {!address && <p className="ml-1 text-gray-600">Not connected</p>}</div>


   <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white p-8 w-full">
        <div className="flex flex-col items-center">
          <img src={polygonLogo} alt="Logo" className="w-16 h-16" />
          <h2 className="text-3xl font-semibold mt-2">Welcome to M3 Pool!</h2>
        </div>
      </div>
     
 <div className="flex mt-4 space-x-4 w-full">
          <button
            onClick={togglePoolZone}
            className={`flex-1 bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 focus:outline-none transition-all text-sm sm:text-base ${
              showPoolZone ? "bg-blue-600" : ""
            }`}
          >
            Pool Zone
          </button>
          <button
            onClick={toggleStatsZone}
            className={`flex-1 bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 focus:outline-none transition-all text-sm sm:text-base ${
              showPoolZone ? "" : "bg-blue-600"
            }`}
          >
            Stats Zone
          </button>

          <button
            onClick={toggleTaskZone}
            className={`flex-1 bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 focus:outline-none transition-all text-sm sm:text-base ${
              showTaskZone ? "bg-blue-600" : ""
            }`}
          >
            Task Zone
          </button>
        </div>

<div className="min-h-screen bg-white  items-center justify-center">
  
      <div className=" items-center w-full">
        <div className=" p-4 bg-gray-100 rounded-md  w-full">
        {showPoolZone &&  <YourComponent balance={balance} joinGame={joinGame} address={address} players={players}/>} {/* Your Pool Zone content */}
        {showStatsZone && <YourStatsBoard userStats={userStats} totalVolume={totalVolume} tx={tx} leaderdoardlist={leaderboardlist} getLeaderBoard={getLeaderBoard} players={players} pastWinners={pastWinners}/>} {/* Your Stats Zone content */}
        {showTaskZone && <TaskZone />}

      
        </div>
        
    </div>
   
      </div>

      <div>
        <div>
        <div>
              {prize !== null ? (
                <p className='text-center'>
                  {prize ? `${prize} Matic was paid to ${winner}` : ' ongoing round'}
                </p>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-green-500 border-opacity-50"></div>
                  <span className="ml-2">Loading winner...</span>
                </div>
              )}
            </div>
        </div>
      </div>
 

        <br />
        {winner ? (
          <button
            onClick={claimPrize}
            disabled={!winner}
            className={!address == winner ? "bg-red-200 px-6 py-3 rounded-full" : "mt-6 bg-blue-500 text-white px-6 py-3 rounded-full focus:outline-none transition-all"}
          >
            {address == winner ? "Claim Bounty" : "not qualified"}
          </button>
        ) : (
          ""
        )}


       

    

     {isOwner? <AdminPage pickWinner={pickWinner} setcommission={setcommission} isOwner={isOwner}/> :""}

      </div>
    </div>
   
)


}

export default Home;
