import React, { useState } from "react";
import { Alert } from "@mui/material";
import { Button, Typography, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import web3 from "../backend/web3";
import Campaign from "../backend/campaign";
import { useRouter } from "next/router";

const ContributionForm = (props) => {
	const [amount, setAmount] = useState();
	const [errorMsg, setErrorMsg] = useState("");
	const [loadingFlag, setLoadingFlag] = useState(false);
	const router = useRouter();

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoadingFlag(true);
		setErrorMsg("");

		const campaign = Campaign(props.address);

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(amount, "ether"),
			});
			alert("Transaction Successful");
			await router.replace(`/campaigns/${props.address}`);
		} catch (error) {
			setErrorMsg({ errorMsg: error.message });
		}
		setLoadingFlag(false);
	};

	return (
		<div style={{ marginLeft: 20, paddingLeft: 20, paddingRight: 20 }}>
			<Typography
				variant="h5"
				style={{
					fontWeight: "bold",
					marginBottom: 20,
					textAlign: "center",
				}}>
				Contribute To This Campaign Now!
			</Typography>

			<div style={{}}>
				<Box
					component="form"
					sx={{
						"& .MuiTextField-root": {
							marginBottom: 2,
						},
						display: "flex",
						flexDirection: "column",
					}}
					noValidate
					autoComplete="off">
					<TextField
						required
						id="outlined-required"
						label="Amount to Contribute (in ether)"
						defaultValue=""
						onChange={(event) => {
							setAmount(event.target.value);
						}}
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
							variant="contained"
							style={{ marginTop: 10, fontWeight: "bold" }}
							onClick={onSubmit}>
							{" "}
							Contribute
						</Button>
					) : (
						<CircularProgress style={{ marginLeft: "45%" }} />
					)}
				</Box>
			</div>
			<hr style={{ color: "gray", marginTop: 20, marginBottom: 20 }} />
			<Typography
				variant="h5"
				style={{
					fontWeight: "bold",
					marginBottom: 20,
					textAlign: "center",
				}}>
				Spending Requests
			</Typography>
			<Typography>
				Have a look at the spending requests made by the contract
				manager. If you are one of the approvers, vote on the spending
				requests to stay in the loop!
			</Typography>

			<div style={{ marginTop: 10 }}>
				<Box
					component="form"
					sx={{
						"& .MuiTextField-root": {
							marginBottom: 2,
						},
						display: "flex",
						flexDirection: "column",
					}}
					noValidate
					autoComplete="off">
					<Button
						variant="contained"
						style={{ marginTop: 10, fontWeight: "bold" }}
						onClick={() =>
							router.push(`/campaigns/${props.address}/requests`)
						}>
						{" "}
						View Requests
					</Button>
				</Box>
			</div>
		</div>
	);
};

export default ContributionForm;
