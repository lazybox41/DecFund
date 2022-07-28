import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { CssBaseline } from "@material-ui/core";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

export default function Header() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const router = useRouter();
	return (
		<Box sx={{ flexGrow: 1, margin: 0 }}>
			<CssBaseline />
			<AppBar
				position="static"
				style={{ backgroundColor: "black", margin: 0 }}>
				<Toolbar>
					<Typography component="div" sx={{ flexGrow: 1 }}>
						<Button
							style={{
								textTransform: "none",
								fontSize: 20,
								fontWeight: "bold",
								fontFamily: "Helvetica",
								color: "white",
							}}
							onClick={() => router.push("/")}>
							DecFund
						</Button>
					</Typography>
					<div>
						<Button
							style={{ color: "white" }}
							id="basic-button"
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
							onClick={() => router.push("/campaigns/new")}>
							CREATE
						</Button>
						<Button
							style={{ color: "white" }}
							id="basic-button"
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
							onClick={() => {
								router.push("/");
								// window.scrollTo({
								// 	top: 450,
								// 	behavior: "smooth",
								// });
							}}>
							DISCOVER
						</Button>
						{/* <Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}>
							<MenuItem>Create New</MenuItem>
							<MenuItem onClick={() => router.push("/")}>
								Show All
							</MenuItem>
						</Menu> */}
					</div>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
