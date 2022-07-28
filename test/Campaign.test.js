const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider({ gasLimit: 100000000000 }));

const compiledFactory = require("../backend/build/CampaignFactory.json");
const compiledCampaign = require("../backend/build/Campaign.json");

let campaign;
let campaignAddress;
let factory;
let accounts;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: compiledFactory.evm.bytecode.object })
		.send({ from: accounts[0], gas: "100000000" });

	await factory.methods.createCampaign("100").send({
		from: accounts[0],
		gas: "100000000",
	});

	const addresses = await factory.methods.getDeployedCampaigns().call();
	campaignAddress = addresses[0];

	//Already deployed, address 2nd arg
	campaign = await new web3.eth.Contract(
		compiledCampaign.abi,
		campaignAddress
	);
});

describe("Campaigns", () => {
	// it("deploys a factory and campaign", () => {
	// 	assert.ok(factory.options.address), assert.ok(campaign.options.address);
	// });

	// it("sets function caller as manager", async () => {
	// 	const manager = await campaign.methods.manager().call();
	// 	assert.equal(manager, accounts[0]);
	// });

	// it("contributor is marked as approvers", async () => {
	// 	await campaign.methods
	// 		.contribute()
	// 		.send({ from: accounts[1], value: "300" });
	// 	const isApprover = await campaign.methods.approvers(accounts[1]).call();
	// 	assert(isApprover);
	// });

	// it("requires min contribution", async () => {
	// 	try {
	// 		await campaign.methods
	// 			.contribute()
	// 			.send({ from: accounts[1], value: "50" });
	// 		assert(false);
	// 	} catch (error) {
	// 		assert(error);
	// 	}
	// });

	// it("allows manager to make a request", async () => {
	// 	await campaign.methods.createRequest("Buy", "300", accounts[1]).send({
	// 		from: accounts[0],
	// 		gas: "10000000",
	// 	});
	// 	const req = await campaign.methods.requests(0).call();
	// 	assert(req.description, "Buy");
	// });

	it("processes requests", async () => {
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei("10", "ether"),
		});

		await campaign.methods
			.createRequest("Buy", web3.utils.toWei("5", "ether"), accounts[1])
			.send({
				from: accounts[0],
				gas: "10000000",
			});

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: "10000000",
		});

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: "10000000",
		});

		let balance = await web3.eth.getBalance(accounts[1]);
		balance = web3.utils.fromWei(balance, "ether");
		balance = parseFloat(balance);

		console.log(balance);
		assert(balance > 104);
	});
});
