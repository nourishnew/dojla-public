import "../App.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import TradePortal from "./TradePortal";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SideNavBar from "./SideNavBar";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import { SnackbarProvider } from "notistack";
import { db } from "../firebase";
import doge from "../img/doge.png";
import btc from "../img/btc.png";
import ada from "../img/ada.png";
import ltc from "../img/ltc.png";
import bch from "../img/bch.png";
import xrp from "../img/xrp.png";
import eth from "../img/eth.png";
import bnb from "../img/bnb.png";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  root: {
    minWidth: 275,
    height: "8em",
    background:
      "linear-gradient(90deg, rgba(203,152,0,1) 0%, rgba(245,219,119,1) 35%);",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  cardtitle: {
    fontSize: 20,
    textAlign: "center",
  },
  pos: {
    marginBottom: 12,
  },
  transaction_title: {
    backgroundColor: "#32297c",
  },
  indicator: {
    backgroundColor: "#ffa001",
  },
  cardPrice: {
    fontSize: 23,
    textAlign: "center",
  },
}));

function Portfolio() {
  const [response, setResponse] = useState(false);
  const [update, setUpdate] = useState(true);
  const [value, setValue] = useState(0);
  const { logout } = useAuth();
  const history = useHistory();
  const { currentUser, userInfo } = useAuth();

  const currencies = [
    {
      value: "DOGE",
      label: "DOGE",
      name: "Dogecoin",
      img: doge,
      amount: 50000,
    },
    {
      value: "BTC",
      label: "BTC",
      name: "Bitcoin",
      img: btc,
      amount: 2,
    },
    {
      value: "ETH",
      label: "ETH",
      name: "Ethereum",
      img: eth,
      amount: 2,
    },
    {
      value: "LTC",
      label: "LTC",
      name: "Litecoin",
      img: ltc,
      amount: 0,
    },
    {
      value: "BNB",
      label: "BNB",
      name: "Binance",
      img: bnb,
      amount: 0,
    },

    {
      value: "ADA",
      label: "ADA",
      name: "Cardano",
      img: ada,
      amount: 0,
    },
    {
      value: "BCH",
      label: "BCH",
      name: "Bitcoin Cash",
      img: bch,
      amount: 0,
    },
    {
      value: "XRP",
      label: "XRP",
      name: "Ripple",
      img: xrp,
      amount: 0,
    },
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios
      .get(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,ADA,XRP,DOGE,BCH,LTC,BNB&tsyms=USD&api_key=${process.env.REACT_APP_CRYPTO_API_KEY}`
      )
      .then(async (res) => {
        setResponse(res.data.DISPLAY);
        let num = 0;
        let d;
        async function fetchMyAPI() {
          await db
            .collection("users")
            .doc(currentUser.uid)
            .get()
            .then((data) => {
              d = data.data();
            });
        }
        await fetchMyAPI();
        Object.keys(res.data.DISPLAY).forEach((item, i) => {
          num +=
            parseFloat(
              res.data.DISPLAY[item].USD.PRICE.replace(/[^0-9.]+/g, "")
            ) * parseFloat(d[item]);
        });
        db.collection("users")
          .doc(currentUser.uid)
          .update({
            portfolio: parseFloat(num.toFixed(2)),
          });
      })
      .catch((error) => console.log(error));
  }, [currentUser, update]);

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
  const classes = useStyles();
  return (
    <div>
      <SnackbarProvider maxSnack={3}>
        <div>
          <div className="dashboardBox">
            <SideNavBar logout={handleLogout} />
            <div className="dashboardContainer">
              <p
                style={{
                  fontFamily: "Akaya Kanadaka, cursive",
                  fontSize: "50px",
                  fontWeight: "500",
                  marginBottom: "1em",
                  color: "#efac35",
                  margin: "3%",
                }}
              >
                Dojla
              </p>
              <p
                style={{
                  margin: "2em",
                  fontFamily: "Montserrat, sans-serif",
                  color: "#32297c",
                  fontWeight: "800",
                  width: "80%",
                }}
              >
                Portfolio
              </p>
              <div className="balanceCards">
                <div
                  className="dashboardCard"
                  variant="outlined"
                  style={{
                    minWidth: "275",
                    height: "9em",
                    backgroundColor: "#32297c",

                    width: "45%",
                    borderRadius: "30px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 3px 6px,rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                >
                  <div
                    className="horizontal_flex"
                    style={{ margin: "auto", height: "100%" }}
                  >
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      color="inherit"
                      style={{
                        color: "#f7f6fd",
                        backgroundColor: "#32297c",
                        margin: "auto",
                        display: "block",
                      }}
                    >
                      <AccountBalanceIcon
                        style={{ color: "#ffa001", fontSize: "50" }}
                      />
                    </IconButton>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className={classes.cardtitle}
                        color="textSecondary"
                        gutterBottom
                        style={{
                          color: "#9ea5cf",
                          fontsize: "10px",
                          fontFamily: "Montserrat, sans-serif",
                          margin: "auto",
                        }}
                      >
                        Portfolio balance
                      </Typography>

                      <Typography
                        variant="body2"
                        className={classes.cardPrice}
                        component="p"
                        style={{
                          color: "#fffef2",
                          fontsize: "25px",
                          fontFamily: "Montserrat, sans-serif",
                          margin: "auto",
                        }}
                      >
                        {userInfo ? `$ ${userInfo.portfolio.toFixed(2)}` : null}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div
                  className="dashboardCard"
                  variant="outlined"
                  style={{
                    minWidth: "275",
                    height: "9em",
                    backgroundColor: "#32297c",

                    width: "45%",
                    borderRadius: "30px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 3px 6px,rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                >
                  <div
                    className="horizontal_flex"
                    style={{ margin: "auto", height: "100%" }}
                  >
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      color="inherit"
                      style={{
                        color: "#f7f6fd",
                        backgroundColor: "#32297c",
                        margin: "auto",
                        display: "block",
                      }}
                    >
                      <AccountBalanceWalletIcon
                        style={{ color: "#ffa001", fontSize: "50" }}
                      />
                    </IconButton>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className={classes.cardtitle}
                        color="textSecondary"
                        gutterBottom
                        style={{
                          color: "#9ea5cf",
                          fontsize: "10px",
                          fontFamily: "Montserrat, sans-serif",
                          margin: "auto",
                        }}
                      >
                        Wallet balance
                      </Typography>

                      <Typography
                        variant="body2"
                        className={classes.cardPrice}
                        component="p"
                        style={{
                          color: "#fffef2",
                          fontsize: "25px",
                          fontFamily: "Montserrat, sans-serif",
                          margin: "auto",
                        }}
                      >
                        {userInfo ? `$ ${userInfo.wallet.toFixed(2)}` : null}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              {response && userInfo ? (
                <div className="list">
                  <table className="gfg">
                    <colgroup></colgroup>
                    <tr>
                      <th>
                        <p className="titleNumber">#</p>
                      </th>
                      <th>
                        <p className="titleName">Name</p>
                      </th>
                      <th>
                        <p className="titlePrice">Price</p>
                      </th>
                      <th>
                        <p className="titleAmount">Amount</p>
                      </th>

                      <th>
                        <p className="titleTotal">Total</p>
                      </th>
                    </tr>
                    {currencies.map((item, index) => (
                      <tr key={index}>
                        <td style={{ fontFamily: "Nunito, sans-serif" }}>
                          {index + 1}
                        </td>
                        <td>
                          <div className="tableNameContainer">
                            <img
                              src={item.img}
                              alt={item.name}
                              style={{
                                width: "25px",
                                height: "25px",
                                position: "relative",
                                marginRight: "20px",
                              }}
                            />
                            <p
                              style={{
                                fontFamily: "Nunito, sans-serif",
                                marginBottom: "0",
                              }}
                            >
                              {item.name}
                            </p>
                          </div>
                        </td>
                        <td style={{ fontFamily: "Nunito, sans-serif" }}>
                          {response[item.label].USD.PRICE}
                        </td>

                        <td style={{ fontFamily: "Nunito, sans-serif" }}>
                          {userInfo[item.label].toFixed(2)}
                        </td>
                        <td style={{ color: "green" }}>
                          ${" "}
                          {parseFloat(
                            parseFloat(
                              response[item.label].USD.PRICE.replace(
                                /[^0-9.]+/g,
                                ""
                              )
                            ).toFixed(2) * parseFloat(userInfo[item.label])
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </table>
                  {/* <div className="tableHeader">
									<p className="name"> Name </p>
									<p className="name"> Price </p>
								</div>
								<hr />
								<div className="table">
									{response.data ? (
										Object.keys(response.data).map((key, i) => {
											return (
												<div className="row">
													<p className="name">
														{" "}
														{i + 1}.{key} :
													</p>
													<p className="name">${response.data[key].USD}</p>
												</div>
											);
										})
									) : (
										<p>Loading</p>
									)}
								</div> */}
                </div>
              ) : (
                <div style={{ width: "100%" }}>
                  <CircularProgress
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      textAlign: "center",
                      fontFamily: "Nunito, sans-serif",
                    }}
                  >
                    Loading ..
                  </p>
                </div>
              )}
            </div>
            <div className="transaction_sec">
              <div>
                <AppBar
                  position="static"
                  classes={{ root: classes.transaction_title }}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    centered
                    inkBarStyle={{ background: "#ffa001" }}
                    classes={{
                      indicator: classes.indicator,
                    }}
                  >
                    <Tab label="Buy" />
                    <Tab label="Sell" />
                    <Tab label="Convert" />
                  </Tabs>
                </AppBar>
                <TradePortal
                  value={value}
                  currencies={currencies}
                  currentUser={currentUser}
                  updatePortfolio={() => {
                    setUpdate(!update);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <footer style={{ width: "80%", margin: "auto" }}>
          <p style={{ margin: "2em" }}>Dojla &#169;</p>
          <p style={{ margin: "2em" }}>
            Contact nourishnew@gmail.com for more info
          </p>
        </footer>
      </SnackbarProvider>
    </div>
  );
}

export default Portfolio;
