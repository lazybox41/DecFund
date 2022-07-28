import React from "react";
import { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import web3 from "../backend/web3";
import { Button, CircularProgress } from "@mui/material";
import Campaign from "../backend/campaign";
import { useRouter } from "next/router";

const RequestRow = (props) => {
	const request = props.request;
	const router = useRouter();
	const [approveFlag, setApproveFlag] = useState(false);
	const [finalizeFlag, setfinalizeFlag] = useState(false);
	const [userApproved, setUserApproved] = useState(false);
	const readyToFinalize = request.approvalCount >= props.totalApprovers / 2;

	const onApprove = async () => {
		try {
			setApproveFlag(true);
			const campaign = Campaign(props.address);
			const accounts = await web3.eth.getAccounts();
			console.log(accounts);

			await campaign.methods.approveRequest(props.id).send({
				from: accounts[0],
			});
			const hasApproved = await campaign.methods
				.hasApproved(props.id)
				.call({ from: accounts[0] });
			setUserApproved(hasApproved);
			console.log(hasApproved);
			router.push(`/campaigns/${props.address}/requests`);
		} catch (error) {}
		setApproveFlag(false);
	};

	const onFinalize = async () => {
		try {
			setfinalizeFlag(true);
			const campaign = Campaign(props.address);
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.finalizeRequest(props.id).send({
				from: accounts[0],
			});
			router.push(`/campaigns/${props.address}/requests`);
		} catch (error) {}
		setfinalizeFlag(false);
	};

	return (
		<TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
			<TableCell align="center" component="th" scope="row">
				{props.id}
			</TableCell>
			<TableCell align="center">{request.description}</TableCell>
			<TableCell align="center">
				{web3.utils.fromWei(request.value, "ether")}
			</TableCell>
			<TableCell align="center">{request.recipient}</TableCell>
			<TableCell align="center">
				{request.approvalCount}/{props.totalApprovers}
			</TableCell>
			<TableCell align="center">
				{!approveFlag ? (
					userApproved ? (
						<Button
							disabled
							variant="contained"
							style={{ color: "green" }}>
							Approved
						</Button>
					) : (
						<Button
							onClick={onApprove}
							variant="contained"
							style={{ backgroundColor: "green" }}>
							Approve
						</Button>
					)
				) : (
					<CircularProgress style={{ marginLeft: 20 }} />
				)}
			</TableCell>
			<TableCell align="center">
				{!readyToFinalize || request.complete ? (
					<Button
						disabled
						onClick={onFinalize}
						variant="contained"
						style={{ color: "teal" }}>
						Finalize
					</Button>
				) : !finalizeFlag ? (
					<Button
						onClick={onFinalize}
						variant="contained"
						style={{ backgroundColor: "teal" }}>
						Finalize
					</Button>
				) : (
					<CircularProgress style={{ marginLeft: 20 }} />
				)}
			</TableCell>
		</TableRow>
	);
};

export default RequestRow;
