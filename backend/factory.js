import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
	CampaignFactory.abi,
	"0x6960836651F327Ed656DaEBfabD6B7AC41f8251a"
);

export default instance;
