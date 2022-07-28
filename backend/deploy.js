const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

//0xDaDCe3F75E35b13CBc33073c77126595d8C21EAB

const provider = new HDWalletProvider(
	"two move shiver smart piece purity rough accident disease image hero satisfy",
	"https://rinkeby.infura.io/v3/0e8b0966c27c4f018a1123c4149d8c77"
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log("Attempting to deploy from account", accounts[0]);

	const result = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
		.send({ from: accounts[0] });

	console.log("Contract deployed to", result.options.address);
	provider.engine.stop();
};
deploy();
