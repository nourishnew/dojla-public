import "../App.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TradePortal from "./TradePortal";
import SideNavBar from "./SideNavBar";
import { SnackbarProvider } from "notistack";

import { db } from "../firebase";

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

function Transactions() {
  const [response, setResponse] = useState(false);
  const [update, setUpdate] = useState(true);
  const [value, setValue] = useState(0);
  const { logout } = useAuth();
  const history = useHistory();
  const [error, setError] = useState(false);
  const { currentUser, userInfo, userTrades } = useAuth();
  const currencies = [
    {
      value: "BTC",
      label: "BTC",
      amount: 2,
    },
    {
      value: "ETH",
      label: "ETH",
      amount: 2,
    },
    {
      value: "LTC",
      label: "LTC",
      amount: 0,
    },
    {
      value: "DOGE",
      label: "DOGE",
      amount: 50000,
    },
    {
      value: "ADA",
      label: "ADA",
      amount: 0,
    },
    {
      value: "BCH",
      label: "BCH",
      amount: 0,
    },
    {
      value: "XRP",
      label: "XRP",
      amount: 0,
    },
    {
      value: "BNB",
      label: "BNB",
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
      setError("");
      await logout();
      history.push("/login");
    } catch (error) {
      console.log(error);
      setError("failed to logout");
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
                Trades
              </p>
              {response && userInfo && userTrades ? (
                <div className="list">
                  <table className="gfg">
                    <colgroup></colgroup>
                    <tr>
                      <th>
                        <p className="titleNumber">#</p>
                      </th>
                      <th>
                        <p className="titleName">Type</p>
                      </th>
                      <th>
                        <p className="titleName">Activity</p>
                      </th>
                      <th>
                        <p className="titleName">Total</p>
                      </th>
                      <th>
                        <p className="titleName">Date of transaction</p>
                      </th>
                    </tr>
                    {userTrades.map((item, i) => {
                      if (item.TYPE === "BUY") {
                        return (
                          <tr key={i}>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              {i + 1}
                            </td>
                            <td
                              style={{
                                fontFamily: "Nunito, sans-serif",
                                color: "GREEN",
                              }}
                            >
                              {item.TYPE}
                            </td>
                            <td>
                              <p style={{ fontFamily: "Nunito, sans-serif" }}>
                                Bought{" "}
                                {item.AMOUNT < 0.1
                                  ? item.AMOUNT.toFixed(5)
                                  : item.AMOUNT.toFixed(2)}{" "}
                                {item.CRYPTO} at ${item.RATE}
                              </p>
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              $
                              {item.DOLLAR < 0.1
                                ? item.DOLLAR.toFixed(5)
                                : item.DOLLAR.toFixed(2)}
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              <p>
                                {item.createdAt
                                  ? item.createdAt.toDate().toDateString()
                                  : null}
                              </p>
                              <p>
                                {item.createdAt
                                  ? item.createdAt
                                      .toDate()
                                      .toLocaleTimeString("en-US")
                                  : null}
                              </p>
                            </td>
                          </tr>
                        );
                      } else if (item.TYPE === "SELL") {
                        return (
                          <tr key={i}>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              {i}
                            </td>
                            <td
                              style={{
                                fontFamily: "Nunito, sans-serif",
                                color: "RED",
                              }}
                            >
                              {item.TYPE}
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              <p style={{ fontFamily: "Nunito, sans-serif" }}>
                                Sold{" "}
                                {item.AMOUNT < 0.1
                                  ? item.AMOUNT.toFixed(5)
                                  : item.AMOUNT.toFixed(2)}{" "}
                                {item.CRYPTO} at ${item.RATE}
                              </p>
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              $
                              {item.DOLLAR < 0.1
                                ? item.DOLLAR.toFixed(5)
                                : item.DOLLAR.toFixed(2)}
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              <p>
                                {item.createdAt
                                  ? item.createdAt.toDate().toDateString()
                                  : null}
                              </p>
                              <p>
                                {item.createdAt
                                  ? item.createdAt
                                      .toDate()
                                      .toLocaleTimeString("en-US")
                                  : null}
                              </p>
                            </td>
                          </tr>
                        );
                      } else if (item.TYPE === "CONVERT") {
                        return (
                          <tr key={i}>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              {i}
                            </td>
                            <td
                              style={{
                                fontFamily: "Nunito, sans-serif",
                                color: "ORANGE",
                              }}
                            >
                              {item.TYPE}
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              Converted{" "}
                              {item.FROMAMOUNT < 0.1
                                ? item.FROMAMOUNT.toFixed(5)
                                : item.FROMAMOUNT.toFixed(2)}{" "}
                              {item.FROM} at ${item.FROMRATE} to {item.TO} (
                              {item.TOAMOUNT < 0.1
                                ? item.TOAMOUNT.toFixed(5)
                                : item.TOAMOUNT.toFixed(2)}
                              )
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              $
                              {item.DOLLAR < 0.1
                                ? item.DOLLAR.toFixed(5)
                                : item.DOLLAR.toFixed(2)}
                            </td>
                            <td style={{ fontFamily: "Nunito, sans-serif" }}>
                              <p>
                                {item.createdAt
                                  ? item.createdAt.toDate().toDateString()
                                  : null}
                              </p>
                              <p>
                                {item.createdAt
                                  ? item.createdAt
                                      .toDate()
                                      .toLocaleTimeString("en-US")
                                  : null}
                              </p>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </table>
                </div>
              ) : (
                <div style={{ width: "100%", marginTop: "10em" }}>
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
            <div className="transaction_sec_trade">
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

export default Transactions;
