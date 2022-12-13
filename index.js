import { ethers } from "./ethers-5.2.esm.min.js"
import { fundMeAbi, fundMeAddress } from "./constants.js"
const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")
const txtEthAmnt = document.getElementById("txtEthAmnt")
const balanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("btnWithdraw")
balanceBtn.onclick = getBalance
connectBtn.onclick = connect
fundBtn.onclick = fund
withdrawBtn.onclick = withdraw


async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectBtn.innerHTML = "Connected!"
    } else {
        connectBtn.innerHTML = "No Metamask!"
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const fundMeContract = new ethers.Contract(fundMeAddress, fundMeAbi, signer);
        try {
            const transResponse = await fundMeContract.withdraw();
            await listenForTransactionMine(transResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
    else {
        alert("Please connect with Web3 Provider and try again.")
    }
}
async function fund() {
    // console.log("Execution start")
    // takes2SecsToComplete();
    // console.log("Execution end")
    // return;
    const ethAmount = document.getElementById("txtEthAmnt").value;
    console.log(`Funding with ${ethAmount}ETH...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum) // here Metamask is the provider. window.ethereum is injected by Metamask into your project.
        const signer = provider.getSigner() // signer is the account selected in Metamask. Make sure this account has some credits in it.
        // console.log("Signer:", signer)
        const contract = new ethers.Contract(fundMeAddress, fundMeAbi, signer)
        try {
            const transResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transResponse, provider);
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transResponse, provider) {
    console.log(`Mining ${transResponse.hash}...`)
    return new Promise((resolve, reject) => {
        //provide.once function calls the callback method only once unlike promise.on method which calls the callback method every time the event happens. 
        provider.once(transResponse.hash, (transReceipt) => {
            console.log(`Completed with ${transReceipt.confirmations} confirmations.`)
            resolve();
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(fundMeAddress);
        console.log(`Total Fund: ${ethers.utils.formatEther(balance)}`)
    }
}






function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    return Math.abs(Math.round(diff));
}

async function takes2SecsToComplete() {
    await new Promise((resolve, reject) => {
        //do stuff here that takes time
        setTimeout(() => {
            console.log("takes2SecsToComplete() completed.")
            resolve("2");
        }, 2000);
    })
}
function takes5SecsToComplete() {
    return new Promise((resolve, reject) => {
        //do stuff here that takes time
        setTimeout(() => {
            console.log("takes5SecsToComplete() completed.")
            resolve("5");
        }, 5000);
    })
}
function takes1SecsToComplete() {
    return new Promise((resolve, reject) => {
        //do stuff here that takes time
        setTimeout(() => {
            console.log("takes1SecsToComplete() completed.")
            resolve("1");
        }, 1000);
    })
}

function parallelCaller2() {
    Promise.all([
        takes5SecsToComplete(),
        takes2SecsToComplete(),
        takes1SecsToComplete()
    ]).then(promiseResultArr => {
        console.log(`All parallel work got completed. Here are the results: ${promiseResultArr.toString()}`)
    })
}

function parallelCaller() {
    Promise.all([
        new Promise((resolve, reject) => {
            //do stuff here
            takes5SecsToComplete();
            resolve("5");
        }),
        new Promise((resolve, reject) => {
            //do stuff here
            takes2SecsToComplete();
            resolve("2");
        }),
        new Promise((resolve, reject) => {
            //do stuff here
            takes1SecsToComplete();
            resolve("1");
        }),
    ]).then(promiseResultArr => {
        console.log(`All parallel work got completed. Here are the results: ${promiseResultArr.toString()}`)
    })
}

function testCatch() {
    let promise = new Promise((resolve, reject) => {
        console.log("promise called");
        throw new Error("Error thrown from promise")
        reject("reject called in promise");
    }).then(result => {
        console.log("first then called")
    })
        .then((result) => {
            console.log("second then called");
            throw new Error("Error in 2nd Then")
        },
            (promiseRejectResult) => {
                console.log(`2nd then reject handle called. Error result: ${promiseRejectResult}`);
            })
        .catch(err => { console.log(`Catch called. Error: ${err}`) })
}

// try {
//     const transResponse = await contract.fund({
//         value: ethers.utils.parseEther(ethAmount),
//     })
//     await listenForTransactionMine(transResponse, provider)
//     console.log("Done!")
// } catch (error) {
//     console.log(error)
// }

