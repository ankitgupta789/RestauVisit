import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import Container from "@mui/material/Container";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Box,
  Badge,
} from "@mui/material";
import { AiOutlineShoppingCart, AiOutlineMenu } from "react-icons/ai";
import ProfileDropDown from "../ProfileDropDown";
import { logout } from "../../services/operations/authAPI";
import logo1 from "../../assets/logo1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
    toast.success("Logged Out");
  };

  const renderMenuItems = () => (
    <>
      {/* Home button  */}
      {(user==null || user?.accountType === "User") && (
        <Button
          key="home"
          onClick={() => {
            navigate("/");
          }}
          sx={{
            my: 2,
            color: "#000080",
            display: "block",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "2px",
              backgroundColor: "#000080",
              bottom: "-2px",
              left: 0,
              transform: "scaleX(0)",
              transformOrigin: "bottom right",
              transition: "transform 0.25s ease-out",
            },
            "&:hover::after": {
              transform: "scaleX(1)",
              transformOrigin: "bottom left",
            },
          }}
          component={Link}
          to="/"
          color="inherit"
        >
          Home
        </Button>
      )}

    
      {/* search  */}
      {/* {( user===null || user?.accountType === "User") && (
        <Button
          key="search"
          onClick={() => {
            navigate("/search");
          }}
          sx={{
            my: 2,
            color: "#000080",
            display: "block",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "2px",
              backgroundColor: "#000080",
              bottom: "-2px",
              left: 0,
              transform: "scaleX(0)",
              transformOrigin: "bottom right",
              transition: "transform 0.25s ease-out",
            },
            "&:hover::after": {
              transform: "scaleX(1)",
              transformOrigin: "bottom left",
            },
          }}
          component={Link}
          to="/search"
          color="inherit"
        >
          Search
        </Button>
      )} */}

      {/* about  */}
      {
        (user==null || user?.accountType==="User" ) &&

        <Button
          key="abt_us"
          onClick={() => {
            navigate("/about");
          }}
          sx={{
            my: 2,
            color: "#000080",
            display: "block",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "2px",
              backgroundColor: "#000080",
              bottom: "-2px",
              left: 0,
              transform: "scaleX(0)",
              transformOrigin: "bottom right",
              transition: "transform 0.25s ease-out",
            },
            "&:hover::after": {
              transform: "scaleX(1)",
              transformOrigin: "bottom left",
            },
          }}
          component={Link}
          to="/about"
          color="inherit"
        >
          About Us
        </Button>
      }

      {/* Reviews  */}
      {
          (user?.accountType==='User') && 
          <Button
            key="home"
            onClick={() => {
              navigate("/");
            }}
            sx={{
              my: 2,
              color: "#000080",
              display: "block",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                backgroundColor: "#000080",
                bottom: "-2px",
                left: 0,
                transform: "scaleX(0)",
                transformOrigin: "bottom right",
                transition: "transform 0.25s ease-out",
              },
              "&:hover::after": {
                transform: "scaleX(1)",
                transformOrigin: "bottom left",
              },
            }}
            component={Link}
            to="/reviews"
            color="inherit"
          >
            Reviews
          </Button>
      }
       {/* Reviews  */}
       {
          (user?.accountType==='User') && 
          <Button
            key="orderHistory"
            onClick={() => {
              navigate("/orderHistory");
            }}
            sx={{
              my: 2,
              color: "#000080",
              display: "block",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                backgroundColor: "#000080",
                bottom: "-2px",
                left: 0,
                transform: "scaleX(0)",
                transformOrigin: "bottom right",
                transition: "transform 0.25s ease-out",
              },
              "&:hover::after": {
                transform: "scaleX(1)",
                transformOrigin: "bottom left",
              },
            }}
            component={Link}
            to="/orderHistory"
            color="inherit"
          >
            Order_history
          </Button>
      }
     

    
      {/* Menu  */}

      {
        (user?.accountType==='Restaurant') && 
        <Button
            key="menu"
            onClick={() => {
              navigate("/menu");
            }}
            sx={{
              my: 2,
              color: "#000080",
              display: "block",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                backgroundColor: "#000080",
                bottom: "-2px",
                left: 0,
                transform: "scaleX(0)",
                transformOrigin: "bottom right",
                transition: "transform 0.25s ease-out",
              },
              "&:hover::after": {
                transform: "scaleX(1)",
                transformOrigin: "bottom left",
              },
            }}
            component={Link}
            to="/menu"
            color="inherit"
          >
            Menu
          </Button>
      }

      {/* Photos  */}
      {
        (user?.accountType==="Restaurant") && 
        (<Button
          key="photos"
          onClick={() => {
            navigate("/photos");
          }}
          sx={{
            my: 2,
            color: "#000080",
            display: "block",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "2px",
              backgroundColor: "#000080",
              bottom: "-2px",
              left: 0,
              transform: "scaleX(0)",
              transformOrigin: "bottom right",
              transition: "transform 0.25s ease-out",
            },
            "&:hover::after": {
              transform: "scaleX(1)",
              transformOrigin: "bottom left",
            },
          }}
          component={Link}
          to="/photos"
          color="inherit"
        >
          Photos
        </Button>)
      }


      {/* My Reviews  */}
      {
        (user?.accountType==='Restaurant')
        && (
          <Button
            key="myreviews"
            onClick={() => {
              navigate("/myReviews");
            }}
            sx={{
              my: 2,
              color: "#000080",
              display: "block",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                backgroundColor: "#000080",
                bottom: "-2px",
                left: 0,
                transform: "scaleX(0)",
                transformOrigin: "bottom right",
                transition: "transform 0.25s ease-out",
              },
              "&:hover::after": {
                transform: "scaleX(1)",
                transformOrigin: "bottom left",
              },
            }}
            component={Link}
            to="/myReviews"
            color="inherit"
          >
            My_Reviews
          </Button>
        )
      }

      {/* Reservations  */}
      {
        user?.accountType==='Restaurant' && 
        (
          <Button
            key="Reservations"
            onClick={() => {
              navigate("/reservations");
            }}
            sx={{
              my: 2,
              color: "#000080",
              display: "block",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "2px",
                backgroundColor: "#000080",
                bottom: "-2px",
                left: 0,
                transform: "scaleX(0)",
                transformOrigin: "bottom right",
                transition: "transform 0.25s ease-out",
              },
              "&:hover::after": {
                transform: "scaleX(1)",
                transformOrigin: "bottom left",
              },
            }}
            component={Link}
            to="/reservations"
            color="inherit"
          >
            Reservations
          </Button>
        )
      }
          
      
      {/* Analytics  */}
      {
        user?.accountType==='Restaurant' && (
          <Button
          key="analytics"
          onClick={() => {
            navigate("/analytics");
          }}
          sx={{
            my: 2,
            color: "#000080",
            display: "block",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "2px",
              backgroundColor: "#000080",
              bottom: "-2px",
              left: 0,
              transform: "scaleX(0)",
              transformOrigin: "bottom right",
              transition: "transform 0.25s ease-out",
            },
            "&:hover::after": {
              transform: "scaleX(1)",
              transformOrigin: "bottom left",
            },
          }}
          component={Link}
          to="/analytics"
          color="inherit"
        >
          Analytics
        </Button>
        )
      }
    </>
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: "#6C63FF",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        sx={{
          backgroundImage: "linear-gradient(to right,#bcdbff, #d2e7ff)",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1px 0",
        }}
      >
        <Container className="w-screen">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "start", gap: 1 }}
          >
            {/* Logo */}

            <img
              src={logo1}
              alt="Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />

            {/* Desktop Menu */}
            {!isMobile && (
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "evenly",
                  gap: 2,
                }}
              >
                {renderMenuItems()}
              </Box>
            )}

            {/* Right Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {token ? (
                <ProfileDropDown />
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    color="primary"
                    variant="outlined"
                    sx={{
                      borderColor: "#6C63FF",
                      color: "#6C63FF",
                      "&:hover": { backgroundColor: "#6C63FF", color: "#fff" },
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    color="primary"
                  >
                    Sign Up
                  </Button>
                </>
              )}

              {/* Cart Icon */}
              {user && user?.accountType=="User" && (
                <IconButton component={Link} to="/cart" color="primary">
                  <Badge badgeContent={totalItems} color="secondary">
                    <AiOutlineShoppingCart size={22} />
                  </Badge>
                  
                </IconButton>
              )}
               {user && user?.accountType == "Restaurant" && (
                          <Link to="/myorders" className="relative">
                            <span style={{ fontSize: "24px", color: "yellow" }}>
                              <AiOutlineShoppingCart />
                            </span>
                            {totalItems > 0 && (
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  color: "yellow",
                                }}
                              >
                                {totalItems}
                              </span>
                            )}
                          </Link>
                        )}
            </Box>

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton color="primary" onClick={handleMobileMenuOpen}>
                  <AiOutlineMenu size={24} />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchorEl}
                  open={Boolean(mobileMenuAnchorEl)}
                  onClose={handleMobileMenuClose}
                  sx={{
                    "& .MuiMenu-paper": {
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                      borderRadius: "10px",
                      padding: "10px",
                    },
                  }}
                >
                  {renderMenuItems()}
                  {token ? (
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  ) : (
                    <>
                      <MenuItem
                        component={Link}
                        to="/login"
                        onClick={handleMobileMenuClose}
                      >
                        Log In
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/signup"
                        onClick={handleMobileMenuClose}
                      >
                        Sign Up
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
