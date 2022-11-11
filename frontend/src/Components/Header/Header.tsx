import React from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { handleDrawerToggle } from "../../reducers/responsive";

export const Header = ({drawerWidth} : {drawerWidth: number}) => {
  const mobileOpen = useSelector(
    (state: RootState) => state.responsive.sidebar
  );
  const dispatch = useDispatch();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          edge="start"
          onClick={() => dispatch(handleDrawerToggle(!mobileOpen))}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h3" noWrap component="div" textAlign="center">
          Answer Me!
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
