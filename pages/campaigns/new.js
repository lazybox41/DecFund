import React from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import factory from "../../backend/factory";
import web3 from "../../backend/web3";
import { Alert } from "@mui/material";
import { useRouter } from "next/router";

function newCampaign(props) {
	const [minCont, setMinCont] = useState("");
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [imgUrl, setImgUrl] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [loadingFlag, setLoadingFlag] = useState(false);

	const router = useRouter();

	const onMinContChange = (event) => {
		setMinCont(event.target.value);
	};

	const onNameChange = (event) => {
		setName(event.target.value);
	};

	const onDescChange = (event) => {
		setDesc(event.target.value);
	};

	const onImgUrlChange = (event) => {
		setImgUrl(event.target.value);
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoadingFlag(true);
		setErrorMsg("");

		const accounts = await web3.eth.getAccounts();

		try {
			await factory.methods
				.createCampaign(minCont, name, desc, imgUrl)
				.send({
					from: accounts[0],
				});
			router.push("/");
		} catch (error) {
			setErrorMsg({ errorMsg: error.message });
		}

		setLoadingFlag(false);
	};

	return (
		<div style={{ margin: 20 }}>
			<Typography
				variant="h5"
				style={{ fontWeight: "bold", marginBottom: 20 }}>
				Create New Campaign
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
						label="Minimum Contribution (in Wei)"
						defaultValue=""
						onChange={onMinContChange}
					/>
					<TextField
						required
						id="outlined-required"
						label="Campaign Name"
						defaultValue=""
						onChange={onNameChange}
					/>
					<TextField
						required
						id="outlined-required"
						label="Campaign Description"
						defaultValue=""
						onChange={onDescChange}
					/>
					<TextField
						required
						id="outlined-required"
						label="Image URL "
						defaultValue=""
						onChange={onImgUrlChange}
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
						<CircularProgress style={{ marginLeft: 20 }} />
					)}
				</Box>
			</div>
		</div>
	);
}

export default newCampaign;
