import React from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Campaign from "../../../../backend/campaign.js";
import web3 from "../../../../backend/web3.js";
import { Alert } from "@mui/material";
import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
	const item = params.item;
	return {
		props: { item },
	};
}

function newCampaign(props) {
	const [value, setValue] = useState("");
	const [request, setRequest] = useState("");
	const [recipient, setRecipient] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [loadingFlag, setLoadingFlag] = useState(false);

	const router = useRouter();
	const address = props.item;

	const onReqChange = (event) => {
		setRequest(event.target.value);
	};

	const onValueChange = (event) => {
		setValue(event.target.value);
	};

	const onRecipientChange = (event) => {
		setRecipient(event.target.value);
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoadingFlag(true);
		setErrorMsg("");

		try {
			const campaign = Campaign(address);
			const accounts = await web3.eth.getAccounts();
			await campaign.methods
				.createRequest(
					request,
					web3.utils.toWei(value, "ether"),
					recipient
				)
				.send({ from: accounts[0] });
			router.push(`/campaigns/${address}/requests`);
		} catch (error) {
			setErrorMsg({ errorMsg: error.message });
		}

		setLoadingFlag(false);
	};

	return (
		<div style={{ margin: 20 }}>
			<Typography
				onClick={() => {
					router.push(`/campaigns/${address}/requests`);
				}}
				style={{
					fontSize: 20,

					cursor: "pointer",
				}}>
				⬅️ Back
			</Typography>
			<Typography
				variant="h5"
				style={{ fontWeight: "bold", marginTop: 20, marginBottom: 20 }}>
				Create New Request
			</Typography>
			<div style={{}}>
				<Box
					component="form"
					sx={{
						"& .MuiTextField-root": {
							marginBottom: 2,
							// width: "50ch",
						},
						display: "flex",
						flexDirection: "column",
					}}
					noValidate
					autoComplete="off">
					<TextField
						required
						id="outlined-required"
						label="Request Description"
						defaultValue=""
						onChange={onReqChange}
					/>
					<TextField
						required
						id="outlined-required"
						label="Value in Ether"
						defaultValue=""
						onChange={onValueChange}
					/>
					<TextField
						required
						id="outlined-required"
						label="Recipient"
						defaultValue=""
						onChange={onRecipientChange}
					/>

					{errorMsg && (
						<Alert
							severity="error"
							style={
								{
									// width: "50%",
								}
							}>
							{errorMsg.errorMsg}
						</Alert>
					)}

					{!loadingFlag ? (
						<Button
							onClick={onSubmit}
							variant="contained"
							style={{
								fontWeight: "bold",
								padding: 10,
								width: "20%",
								marginTop: 20,
							}}>
							Create
						</Button>
					) : (
						<div style={{ display: "flex" }}>
							<CircularProgress style={{ marginLeft: 20 }} />
							<Typography
								style={{ marginTop: 10, marginLeft: 10 }}>
								This may take a while!
							</Typography>
						</div>
					)}
				</Box>
			</div>
		</div>
	);
}

export default newCampaign;
