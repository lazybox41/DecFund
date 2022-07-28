import React from "react";
import factory from "../backend/factory";
import Campaign from "../backend/campaign";
import AddIcon from "@mui/icons-material/Add";
import { Grid } from "@mui/material";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import bg from "../public/bg.png";

const index = ({ campaigns }) => {
	const items = campaigns.map((item) => {
		return {
			header: item,
			description: (
				<Link
					// as={`/campaigns/${item}`}
					href={{
						pathname: `/campaigns/${item}`,
						// query: { item },
					}}>
					<a>View campaign</a>
				</Link>
			),
			fluid: true,
		};
	});

	const [campaignList, setCampaignList] = useState([]);
	async function getSummary() {
		try {
			const summary = await Promise.all(
				campaigns.map((campaign, i) =>
					Campaign(campaigns[i]).methods.getSummary().call()
				)
			);

			setCampaignList(summary);
			return summary;
		} catch (e) {
			console.log(e);
		}
	}

	const router = useRouter();

	useEffect(() => {
		getSummary();
	}, []);

	return (
		<div>
			<div
				style={{
					backgroundImage: `url(${bg.src})`,
					backgroundSize: "cover",
				}}>
				<Container
					style={{
						height: 400,
						display: "flex",
						flexDirection: "column",
						paddingTop: 25,
						justifyContent: "space-around",
					}}>
					<div
						style={{
							display: "flex",
							height: "40%",
							flexDirection: "column",
							justifyContent: "center",
							textAlign: "center",
						}}>
						<Typography
							variant="h2"
							style={{
								fontWeight: "bold",
								marginBottom: 15,
								color: "white",
							}}>
							DecFund
						</Typography>
						<Typography
							variant="subtitle2"
							style={{
								color: "darkgrey",
								textTransform: "capitalize",
								fontSize: 24,
							}}>
							Welcome to the world of Decentralized Crowdfunding.
							More transparency, security and efficiency!
						</Typography>
					</div>
				</Container>
			</div>
			<div style={{ margin: 20 }}>
				{/* <hr style={{ marginBottom: 20 }} /> */}
				<div
					style={{
						display: "flex",
					}}>
					<Typography
						variant="h5"
						style={{
							fontWeight: "bold",
							marginBottom: 20,
							flex: 4,
						}}>
						Open Campaigns
					</Typography>
					<div style={{}}>
						<Button
							variant="contained"
							onClick={() => router.push("/campaigns/new")}>
							<AddIcon />
							<Typography style={{ fontWeight: "bold" }}>
								Create Campaign
							</Typography>
						</Button>
					</div>
				</div>

				<div style={{}}>
					<div style={{ flexGrow: 1 }}>
						<Grid
							container
							spacing={2}
							direction="row"
							justify="flex-start"
							alignItems="flex-start">
							{campaignList.map((el, i) => (
								<Grid item xs={12} sm={6} md={3}>
									<Card
										onClick={() => {
											router.push(
												`/campaigns/${items[i].header}`
											);
										}}
										sx={{
											maxWidth: 350,
											height: 450,
											cursor: "pointer",
										}}>
										<CardMedia
											component="img"
											height="140"
											src={el[7]}
											alt="campaign"
										/>
										{console.log(el[6].split("."))}
										<CardContent>
											<Typography
												gutterBottom
												variant="h5"
												component="div">
												{el[5]}
											</Typography>
											<Typography
												gutterBottom
												// variant="h6"
												style={{
													overflowWrap: "break-word",
												}}
												component="div">
												By {el[4]}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary">
												{el[6].split(".")[0]}
											</Typography>
										</CardContent>
										<CardActions></CardActions>
									</Card>
								</Grid>
							))}
						</Grid>
					</div>
				</div>
			</div>
		</div>
	);
};

index.getInitialProps = async () => {
	const campaigns = await factory.methods.getDeployedCampaigns().call();
	return { campaigns };
};

export default index;
