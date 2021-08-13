import "../App.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useAuth } from "../context/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import { db } from "../firebase";
import Dialog from "@material-ui/core/Dialog";

function TradePortal(props) {
  const { value, currencies, updatePortfolio } = props;

  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [convertFromAmount, setConvertFromAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const handleBuyValueChange = (event) => {
    setBuyAmount(event.target.value);
  };
  const handleSellValueChange = (event) => {
    setSellAmount(event.target.value);
  };
  const handleConvertFromValueChange = (event) => {
    setConvertFromAmount(event.target.value);
  };

  const handleChangeBuyCurrency = (event) => {
    setBuyCryptoType(event.target.value);
  };
  const handleChangeSellCurrency = (event) => {
    setSellCryptoType(event.target.value);
  };
  const handleChangeConvertFromCurrency = (event) => {
    setConvertFromCryptoType(event.target.value);
  };
  const handleChangeConvertToCurrency = (event) => {
    setConvertToCryptoType(event.target.value);
  };
  const [numType, setNumType] = useState(currencies[0].label);

  const [buyCryptoType, setBuyCryptoType] = useState(currencies[0].label);
  const [sellCryptoType, setSellCryptoType] = useState(currencies[0].label);
  const [convertFromCryptoType, setConvertFromCryptoType] = useState(
    currencies[0].label
  );
  const [convertToCryptoType, setConvertToCryptoType] = useState(
    currencies[0].label
  );

  const [error, setError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser, userInfo } = useAuth();
  const [openDialogue, setOpenDialogue] = useState(false);
  function handleClose() {
    setOpenDialogue(false);
  }

  useEffect(() => {
    if (value === 0) {
      setNumType(buyCryptoType);
    } else if (value === 1) {
      setNumType(sellCryptoType);
    } else if (value === 2) {
      setNumType(convertFromCryptoType);
    }
  }, [buyCryptoType, sellCryptoType, convertFromCryptoType, value]);
  async function sellCrypto(amount, type) {
    if (amount <= 0) {
      enqueueSnackbar("Enter valid amount", {
        variant: "error",
      });
      return;
    }
    setLoading(true);
    axios
      .get(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${sellCryptoType}&tsyms=USD&api_key=${process.env.REACT_APP_CRYPTO_API_KEY}`
      )
      .then(async (res) => {
        let bool;
        if (type === "$") {
          bool =
            amount > res.data[sellCryptoType].USD * userInfo[sellCryptoType];
        } else {
          bool = amount > userInfo[sellCryptoType];
        }
        if (bool) {
          setError("Not enough crypto on portfolio");
          enqueueSnackbar("Not enough crypto on portfolio", {
            variant: "error",
          });
        } else {
          await db
            .collection("users")
            .doc(currentUser.uid)
            .collection("transactions")
            .doc()
            .set({
              TYPE: "SELL",
              CRYPTO: sellCryptoType,
              AMOUNT:
                type !== "$"
                  ? parseFloat(amount)
                  : parseFloat(amount / res.data[sellCryptoType].USD),
              RATE: res.data[sellCryptoType].USD,
              DOLLAR:
                type !== "$"
                  ? parseFloat(res.data[sellCryptoType].USD * amount)
                  : parseFloat(amount),
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async (data) => {
              let obj = {};
              obj[sellCryptoType] =
                type !== "$"
                  ? parseFloat(userInfo[sellCryptoType]) - parseFloat(amount)
                  : parseFloat(userInfo[sellCryptoType]) -
                    parseFloat(amount / res.data[sellCryptoType].USD);
              obj["wallet"] =
                type !== "$"
                  ? parseFloat(userInfo.wallet) +
                    parseFloat(res.data[sellCryptoType].USD * amount)
                  : parseFloat(userInfo.wallet) + parseFloat(amount);
              await db.collection("users").doc(currentUser.uid).update(obj);
              enqueueSnackbar("Sold crypto", {
                variant: "success",
              });
              setOpenDialogue(true);
            });
        }
      })
      .finally(() => {
        updatePortfolio();
        setLoading(false);
      });
  }

  async function buyCrypto_(amount, type) {
    if (amount <= 0) {
      enqueueSnackbar("Enter valid amount", {
        variant: "error",
      });
      return;
    }
    setLoading(true);

    axios
      .get(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${buyCryptoType}&tsyms=USD&api_key=${process.env.REACT_APP_CRYPTO_API_KEY}`
      )
      .then(async (res) => {
        let bool;
        if (type === "$") {
          bool = amount > userInfo.wallet;
        } else {
          bool = res.data[buyCryptoType].USD * amount > userInfo.wallet;
        }
        if (bool) {
          setError("Not enough money on wallet");
          enqueueSnackbar("Not enough money on wallet", {
            variant: "error",
          });
        } else {
          await db
            .collection("users")
            .doc(currentUser.uid)
            .collection("transactions")
            .doc()
            .set({
              TYPE: "BUY",
              CRYPTO: buyCryptoType,
              AMOUNT:
                type !== "$"
                  ? parseFloat(amount)
                  : parseFloat(amount / res.data[buyCryptoType].USD),
              RATE: res.data[buyCryptoType].USD,
              DOLLAR:
                type !== "$"
                  ? parseFloat(res.data[buyCryptoType].USD * amount)
                  : parseFloat(amount),
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async (data) => {
              let obj = {};
              obj[buyCryptoType] =
                type !== "$"
                  ? parseFloat(userInfo[buyCryptoType]) + parseFloat(amount)
                  : parseFloat(userInfo[buyCryptoType]) +
                    parseFloat(amount / res.data[buyCryptoType].USD);
              obj["wallet"] =
                type !== "$"
                  ? parseFloat(userInfo.wallet) -
                    parseFloat(res.data[buyCryptoType].USD * amount)
                  : parseFloat(userInfo.wallet) - parseFloat(amount);
              await db.collection("users").doc(currentUser.uid).update(obj);
              enqueueSnackbar("Bought crypto", {
                variant: "success",
              });
            });
          setOpenDialogue(true);
        }
      })
      .finally(() => {
        updatePortfolio();
        setLoading(false);
      });
  }
  async function convertCrypto(amount, from, to, type) {
    if (from === to) {
      enqueueSnackbar("Choose another currency to convert to", {
        variant: "error",
      });
      return;
    }

    if (amount <= 0) {
      enqueueSnackbar("Enter valid amount", {
        variant: "error",
      });
      return;
    }
    setLoading(true);
    axios
      .get(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${from},${to}&tsyms=USD&api_key=${process.env.REACT_APP_CRYPTO_API_KEY}`
      )
      .then(async (res) => {
        let bool;
        if (type === "$") {
          bool = amount > res.data[from].USD * userInfo[from];
        } else {
          bool = amount > userInfo[from];
        }
        if (bool) {
          setError("Not enough crypto on portfolio to convert");
          enqueueSnackbar("Not enough crypto on portfolio to convert", {
            variant: "error",
          });
        } else {
          await db
            .collection("users")
            .doc(currentUser.uid)
            .collection("transactions")
            .doc()
            .set({
              TYPE: "CONVERT",
              FROM: from,
              TO: to,
              FROMAMOUNT:
                type !== "$"
                  ? parseFloat(amount)
                  : parseFloat(amount / res.data[from].USD),
              TOAMOUNT:
                type !== "$"
                  ? parseFloat(res.data[from].USD * amount) /
                    parseFloat(res.data[to].USD)
                  : parseFloat(amount) / parseFloat(res.data[to].USD),
              FROMRATE: res.data[from].USD,
              TORATE: res.data[to].USD,
              DOLLAR:
                type !== "$"
                  ? parseFloat(res.data[from].USD * amount)
                  : parseFloat(amount),
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async (data) => {
              let obj = {};
              obj[from] =
                type !== "$"
                  ? parseFloat(userInfo[from]) - parseFloat(amount)
                  : parseFloat(userInfo[from]) -
                    parseFloat(amount / res.data[from].USD);
              obj[to] =
                type !== "$"
                  ? parseFloat(userInfo[to]) +
                    parseFloat((res.data[from].USD * amount) / res.data[to].USD)
                  : parseFloat(userInfo[to]) +
                    parseFloat(amount / res.data[to].USD);
              await db.collection("users").doc(currentUser.uid).update(obj);
              enqueueSnackbar("Converted crypto", {
                variant: "success",
              });
            });
          setOpenDialogue(true);
        }
      })
      .finally(() => {
        updatePortfolio();
        setLoading(false);
      });
  }

  return (
    <div>
      <Dialog onClose={handleClose} open={openDialogue} fullWidth maxWidth="sm">
        <div style={{ margin: "2em" }}>
          <div class="success-checkmark">
            <div class="check-icon">
              <span class="icon-line line-tip"></span>
              <span class="icon-line line-long"></span>
              <div class="icon-circle"></div>
              <div class="icon-fix"></div>
            </div>
          </div>
          <p style={{ textAlign: "center" }}>Trade Successful</p>
          <Button
            variant="contained"
            style={{
              width: "50%",
              margin: "auto",
              display: "block",
              backgroundColor: "#ffa001",
              fontFamily: "Nunito, sans-serif",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </Dialog>
      {value === 0 ? (
        <div className="buy_sec">
          <div className="horizontal_flex" style={{ margin: "1em" }}>
            <p style={{ margin: "auto", width: "20px" }}>{numType}</p>
            <input
              className="input_box"
              type="number"
              value={buyAmount}
              placeholder="Enter the amount"
              onChange={handleBuyValueChange}
            />
            <IconButton
              disableRipple={true}
              className="switch"
              style={{ borderRadius: "0%", height: "100%", margin: "auto" }}
              onClick={(e) => {
                numType === "$" ? setNumType(buyCryptoType) : setNumType("$");
              }}
            >
              <SwapVertIcon />
            </IconButton>
          </div>
          {userInfo ? (
            <p style={{ margin: "auto", color: "GREEN" }}>
              Balance: {userInfo[buyCryptoType].toFixed(2)} {buyCryptoType}
            </p>
          ) : null}

          <TextField
            style={{ width: "50%", margin: "auto", marginTop: "2em" }}
            id="outlined-select-currency-native"
            select
            value={buyCryptoType}
            onChange={handleChangeBuyCurrency}
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
            variant="outlined"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <Button
            variant="contained"
            disable={loading}
            style={{
              width: "50%",
              margin: "auto",
              marginTop: "2em",
              backgroundColor: "#ffa001",
              fontFamily: "Nunito, sans-serif",
            }}
            onClick={() => {
              buyCrypto_(buyAmount, numType);
            }}
          >
            {loading ? (
              <CircularProgress
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                }}
              />
            ) : (
              "Buy"
            )}
          </Button>
          {userInfo && userInfo["wallet"] > 0.1 ? (
            <p style={{ margin: "auto", color: "GREEN" }}>
              Wallet Balance: {userInfo["wallet"].toFixed(2)}
            </p>
          ) : (
            <p style={{ margin: "auto", color: "RED", textAlign: "center" }}>
              You dont have enough balance on your wallet. Consider selling some
              currencies first
            </p>
          )}
        </div>
      ) : value === 1 ? (
        <div className="buy_sec">
          <div className="horizontal_flex" style={{ margin: "1em" }}>
            <p style={{ margin: "auto", width: "20px" }}>{numType}</p>

            <input
              className="input_box"
              type="number"
              placeholder="enter the amount"
              value={sellAmount}
              onChange={handleSellValueChange}
            />
            <IconButton
              disableRipple={true}
              className="switch"
              style={{ borderRadius: "0%", height: "100%", margin: "auto" }}
              onClick={(e) => {
                numType === "$" ? setNumType(sellCryptoType) : setNumType("$");
              }}
            >
              <SwapVertIcon />
            </IconButton>
          </div>
          {userInfo ? (
            <p style={{ margin: "auto", color: "GREEN" }}>
              Balance: {userInfo[sellCryptoType].toFixed(2)} {sellCryptoType}
            </p>
          ) : null}
          <TextField
            style={{ width: "50%", margin: "auto", marginTop: "2em" }}
            id="outlined-select-currency-native"
            select
            value={sellCryptoType}
            onChange={handleChangeSellCurrency}
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
            variant="outlined"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>

          <Button
            variant="contained"
            disable={loading}
            style={{
              width: "50%",
              margin: "auto",
              marginTop: "2em",
              backgroundColor: "#ffa001",
            }}
            onClick={() => {
              sellCrypto(sellAmount, numType);
            }}
          >
            {loading ? (
              <CircularProgress
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                }}
              />
            ) : (
              "Sell"
            )}
          </Button>
        </div>
      ) : (
        <div className="buy_sec">
          <div className="horizontal_flex" style={{ margin: "1em" }}>
            <p style={{ margin: "auto", width: "20px" }}>{numType}</p>

            <input
              className="input_box"
              type="number"
              placeholder="enter the amount"
              value={convertFromAmount}
              onChange={handleConvertFromValueChange}
            />
            <IconButton
              disableRipple={true}
              className="switch"
              style={{ borderRadius: "0%", height: "100%", margin: "auto" }}
              onClick={(e) => {
                numType === "$"
                  ? setNumType(convertFromCryptoType)
                  : setNumType("$");
              }}
            >
              <SwapVertIcon />
            </IconButton>
          </div>
          {userInfo ? (
            <p style={{ margin: "auto", color: "GREEN" }}>
              Balance: {userInfo[convertFromCryptoType].toFixed(2)}
              {convertFromCryptoType}
            </p>
          ) : null}
          <TextField
            style={{ width: "50%", margin: "auto", marginTop: "2em" }}
            id="outlined-select-currency-native"
            select
            value={convertFromCryptoType}
            onChange={handleChangeConvertFromCurrency}
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
            variant="outlined"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            style={{ width: "50%", margin: "auto", marginTop: "2em" }}
            id="outlined-select-currency-native"
            select
            value={convertToCryptoType}
            onChange={handleChangeConvertToCurrency}
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
            variant="outlined"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <Button
            variant="contained"
            disable={loading}
            style={{
              width: "50%",
              margin: "auto",
              marginTop: "2em",
              backgroundColor: "#ffa001",
            }}
            onClick={() => {
              convertCrypto(
                convertFromAmount,
                convertFromCryptoType,
                convertToCryptoType,
                numType
              );
            }}
          >
            {loading ? (
              <CircularProgress
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                }}
              />
            ) : (
              "Convert"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default TradePortal;
