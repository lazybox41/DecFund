import { Typography } from "@mui/material";
import React from "react";
import Campaign from "../../backend/campaign";
import web3 from "../../backend/web3";
import ContributionForm from "../../components/ContributionForm";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core";

export async function getServerSideProps({ params }) {
	const campaignAddress = params.item;
	const campaign = Campaign(campaignAddress);
	const summary = await campaign.methods.getSummary().call();

	return {
		props: {
			id: campaignAddress,
			minimumContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4],
			name: summary[5],
			description: summary[6],
			image: summary[7],
		},
	};
}

const show = ({
	id,
	minimumContribution,
	balance,
	requestsCount,
	approversCount,
	manager,
	name,
	description,
	image,
}) => {
	const router = useRouter();

	return (
		<div
			style={{
				margin: 30,
			}}>
			<Typography
				variant="h3"
				style={{ fontWeight: "bold", marginBottom: 20 }}>
				{name}
			</Typography>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					["@media (max-width:700px)"]: {
						// eslint-disable-line no-useless-computed-key
						flexDirection: "column",
					},
				}}>
				<div
					style={{
						marginRight: 20,
						flex: "50%",
						["@media (max-width:700px)"]: {
							// eslint-disable-line no-useless-computed-key
							backgroundColor: "red",
						},
					}}>
					<Typography
						// variant="h6"
						style={{ marginBottom: 20, textAlign: "justify" }}>
						{description}
					</Typography>
					<div style={{}}>
						<div style={{}}>
							<Typography style={{ marginTop: 20 }}>
								{" "}
								Minimum Contribution :
							</Typography>
							<Typography variant="h5">
								{web3.utils.fromWei(
									minimumContribution,
									"ether"
								)}{" "}
								ether / {minimumContribution} wei
							</Typography>
							<Typography style={{ marginTop: 20 }}>
								{" "}
								Campaign Address :
							</Typography>
							<Typography variant="h5">{id}</Typography>

							<Typography style={{ marginTop: 20 }}>
								Contract Balance :
							</Typography>
							<Typography variant="h5">
								{web3.utils.fromWei(balance, "ether")} ether /{" "}
								{balance} wei
							</Typography>

							<Typography style={{ marginTop: 20 }}>
								{" "}
								Campaign Manager Address :
							</Typography>
							<Typography variant="h5">{manager}</Typography>

							<Typography style={{ marginTop: 20 }}>
								Campaign Requests :
							</Typography>
							<Typography variant="h5">
								{requestsCount}
							</Typography>

							<Typography style={{ marginTop: 20 }}>
								Campaign Approvers Count :
							</Typography>
							<Typography variant="h5">
								{approversCount}
							</Typography>
						</div>
					</div>
				</div>
				<div
					style={{
						marginLeft: 20,
						flex: "50%",
						["@media (max-width:700px)"]: {
							// eslint-disable-line no-useless-computed-key
						},
					}}>
					<div
						style={{
							marginBottom: 20,
							marginLeft: 100,
							alignItems: "center",
						}}>
						<img
							src={image}
							style={{ width: 400, borderRadius: 10 }}
							alt="campaign"
						/>
					</div>

					<ContributionForm address={id} />
				</div>
			</div>
		</div>
	);
};

export default show;
