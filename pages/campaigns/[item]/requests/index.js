import { Button, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import Campaign from "../../../../backend/campaign";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RequestRow from "../../../../components/RequestRow";

export async function getServerSideProps({ params }) {
	const item = params.item;
	const campaign = Campaign(item);
	const summary = await campaign.methods.getSummary().call();
	const numRequests = summary[2];

	const totalApprovers = await campaign.methods.approversCount().call();

	const requests = await Promise.all(
		Array(parseInt(numRequests))
			.fill()
			.map((element, index) => {
				return campaign.methods.requests(index).call();
			})
	);

	const req = JSON.parse(JSON.stringify(requests));

	return {
		props: {
			item: item,
			requests: req,
			numRequests: numRequests,
			totalApprovers: totalApprovers,
		},
	};
}

const index = (props) => {
	const router = useRouter();

	return (
		<div style={{ margin: 20 }}>
			<div style={{}}>
				<Typography variant="h4" style={{ fontWeight: "bold" }}>
					Requests for Campaign{" "}
				</Typography>
				<Typography variant="h5">
					Campaign Address {props.item}
				</Typography>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
					}}>
					<Typography variant="h5" style={{ marginTop: 30 }}>
						{props.numRequests} Pending Requests
					</Typography>
					<Button
						variant="contained"
						style={{
							height: "20",
							marginTop: 20,
						}}
						onClick={() => {
							router.push(
								`/campaigns/${props.item}/requests/new`
							);
						}}>
						CREATE NEW REQUEST
					</Button>
				</div>
				<TableContainer
					component={Paper}
					style={{ margincenter: 20, marginTop: 20 }}>
					<Table sx={{}} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell
									style={{
										fontWeight: "bold",
										fontSize: 16,
									}}>
									Request ID
								</TableCell>
								<TableCell
									style={{
										fontWeight: "bold",
										fontSize: 16,
										fontSize: 16,
									}}>
									Request Description
								</TableCell>
								<TableCell
									style={{ fontWeight: "bold", fontSize: 16 }}
									align="center">
									Value (in ether)
								</TableCell>
								<TableCell
									style={{ fontWeight: "bold", fontSize: 16 }}
									align="center">
									Recipient
								</TableCell>
								<TableCell
									style={{ fontWeight: "bold", fontSize: 16 }}
									align="center">
									Approval Count
								</TableCell>
								<TableCell
									style={{ fontWeight: "bold", fontSize: 16 }}
									align="center">
									Approve
								</TableCell>
								<TableCell
									style={{ fontWeight: "bold", fontSize: 16 }}
									align="center">
									Finalize
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{props.requests.map((request, index) => (
								<RequestRow
									request={request}
									key={index}
									id={index}
									address={props.item}
									totalApprovers={props.totalApprovers}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default index;
