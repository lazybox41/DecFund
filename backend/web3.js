import Web3 from "web3";

let web3;

//check if code is running on browser or window and if in window, it has metamask or not
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
	//Browser + metamask
	window.ethereum.request({ method: "eth_requestAccounts" });
	web3 = new Web3(window.ethereum);
} else {
	//Server OR Browser without metamask
	const provider = new Web3.providers.HttpProvider(
		"https://rinkeby.infura.io/v3/0e8b0966c27c4f018a1123c4149d8c77"
	);
	web3 = new Web3(provider);
}

export default web3;
