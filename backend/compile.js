const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const src = fs.readFileSync(campaignPath, "utf-8");

const input = {
	language: "Solidity",
	sources: {
		"Campaign.sol": {
			content: src,
		},
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["*"],
			},
		},
	},
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

for (let contract in output.contracts["Campaign.sol"]) {
	fs.outputJSONSync(
		path.resolve(buildPath, contract + ".json"),
		output.contracts["Campaign.sol"][contract]
	);
}
