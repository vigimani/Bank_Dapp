import {
  Tr,
  Td,
  Flex,
  Table,
  Th,
  Thead,
  Tbody,
  useToast,
} from "@chakra-ui/react";
import { useAccount, useProvider, useBalance } from "wagmi";
import { useState, useEffect } from "react";
import Contract from "../../artifacts/contracts/Bank.sol/Bank";
import { ethers } from "ethers";

export default function Eventslist() {
  const contractAddress = "0xf389A9478da87Dd46C5ED9AD4D481b9A45Bc488a";
  //WAGMI
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const [transactions, setTransactions] = useState([]);
//   const { data } = useBalance({
//         address: address,
//         watch: true,
//   })

  //CHAKRA-UI
  const toast = useToast()


  useEffect(() => {
    updatetransactions();
  }, []);

  useEffect(() => {
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider)
    eventListener(contract)
    return () => {
        contract.removeAllListeners();
    };
}, [])

const eventListener = async(contract) => {
    const startBlockNumber = await provider.getBlockNumber();
    contract.on('etherDeposited', (...args) => {
        const event = args[args.length - 1];
        console.log(event)
        if(event.blockNumber <= startBlockNumber) return; // do not react to this event
        toast({
            title: 'Deposit Event',
            description: "By : " + event.args.account + ", Amount : " + ethers.utils.formatEther(event.args.amount) + " Eth",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    })
}

    // provider.send('eth_getBlockByHash', [ blockHash, true ]).then((block) => {
    //     console.log(block);
    // });

  const updatetransactions = async () => {
    const contract = await new ethers.Contract(
      contractAddress,
      Contract.abi,
      provider
    );
    const filter = {
      address: contractAddress,
    };
    let events = await contract.queryFilter(filter, 8361848);
    console.log(events)
    let allTheEvents = [];
    for await (const event of events) {
      const txnReceipt = await event.getTransactionReceipt();
      let eventLog = txnReceipt.logs[0]; // could be any index
      let log = contract.interface.parseLog(eventLog); // Use the contracts interface
      allTheEvents.push(log);
    }
    console.log(allTheEvents);
    setTransactions(allTheEvents);
    let eventsfiltered = events.filter((e) => e.event == "etherDeposited");
  };

  const timestampconvert = (date) => {
    let milliseconds = 1000*date
    let dateObject = new Date(milliseconds)
    return dateObject.toLocaleString()
  }

  return (
    <Flex direction="column" mt="1rem">
      <Table>
        <Thead>
        <Tr>
            <Th>Time</Th>
            <Th>Name</Th>
            <Th>Account</Th>
            <Th>Amount</Th>
        </Tr>
        </Thead>
        <Tbody>
        {transactions.map((event, index) => {
          return (
            <Tr key={index}>
            <Td>{timestampconvert((event.args.when).toString())}</Td>
            {event.eventFragment.name == "etherDeposited" ? (
                <>
                <Td color="green">{event.eventFragment.name}</Td>
                <Td color="green">{event.args.account}</Td>
                <Td color="green" >{ethers.utils.formatEther(event.args.amount)} ETH</Td>
                </>
                ):(        
                    <>        
                    <Td color="red">{event.eventFragment.name}</Td>
                    <Td color="red">{event.args.account}</Td>
                    <Td color="red">-{ethers.utils.formatEther(event.args.amount)} ETH</Td>
                    </>
                )}
            </Tr>
          );
        })}
        </Tbody>
      </Table>
    </Flex>
  );
}
