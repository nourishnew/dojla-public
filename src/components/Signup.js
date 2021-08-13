import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import dogeImg from "../img/dogeSignup.png";
import Button from "@material-ui/core/Button";
import appImg from "../img/dashboardImg.png";
import transImg from "../img/transactions.png";
import OfflineBoltIcon from "@material-ui/icons/OfflineBolt";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LockIcon from "@material-ui/icons/Lock";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const lastNameRef = useRef();
  const firstNameRef = useRef();

  const passwordConfirmRef = useRef();
  const { signup, logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    handleLogout();
  }, []);

  async function handleLogout() {
    try {
      setError("");
      await logout();
    } catch (error) {
      setError("failed to logout");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(
        firstNameRef.current.value,
        lastNameRef.current.value,
        emailRef.current.value,
        passwordRef.current.value
      )
        .then(() => {
          history.push("/");
        })
        .catch((error) => {
          setError(error.message);
        });
    } catch (error) {}

    setLoading(false);
  }

  return (
    <div>
      <div className="loginBox">
        <div className="loginArt">
          <a
            href="https://www.producthunt.com/posts/dojla?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dojla"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=302009&theme=light"
              alt="Dojla - Learn to trade top cryptocurrencies. Buy, sell and convert | Product Hunt"
              style={{ width: "250px", height: "54px" }}
              width="250"
              height="54"
            />
          </a>
          <p
            style={{
              fontFamily: "Akaya Kanadaka, cursive",
              fontSize: "50px",
              fontWeight: "500",
              marginBottom: "1em",
              margin: "1em",
            }}
          >
            Dojla
          </p>
          <p
            style={{
              fontSize: "40px",
              textAlign: "center",
              overflowWrap: "break-word",
              fontFamily: "Fredoka One, cursive",
              color: "#716047",
              margin: "1%",
            }}
          >
            Frustrated with the volatility of cryptocurrencies?
          </p>
          <p
            style={{
              fontSize: "25px",
              fontFamily: "Nunito, sans-serif",
              fontWeight: "600",
              textAlign: "center",
              overflowWrap: "break-word",
              margin: "1%",
            }}
          >
            A Cryptocurrency trading simulator built for crypto enthusiasts.
          </p>

          <p
            style={{
              fontSize: "25px",
              fontFamily: "Fredoka One, cursive",
              textAlign: "center",
              overflowWrap: "break-word",
              margin: "1%",
              color: "#716047",
            }}
          >
            All users get 100k fake Dogecoins to get started.
          </p>
          <img
            className="dogeSignup"
            src={dogeImg}
            alt="doge icon"
            style={{
              width: "30%",
              height: "20%",
              position: "relative",
              margin: "auto",
              display: "block",
            }}
          />
          <p
            style={{
              fontSize: "25px",
              fontFamily: "Fredoka One, cursive",
              textAlign: "center",
              overflowWrap: "break-word",
              margin: "3%",
              color: "#716047",
            }}
          >
            Dojla is the easiest place to learn and simulate cryptocurrency
            trading without fear.
          </p>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            style={{ position: "relative", bottom: "5%" }}
          >
            <path
              fill="#bd8d46"
              fill-opacity="1"
              d="M0,32L20,64C40,96,80,160,120,165.3C160,171,200,117,240,128C280,139,320,213,360,245.3C400,277,440,267,480,240C520,213,560,171,600,149.3C640,128,680,128,720,117.3C760,107,800,85,840,101.3C880,117,920,171,960,181.3C1000,192,1040,160,1080,128C1120,96,1160,64,1200,85.3C1240,107,1280,181,1320,213.3C1360,245,1400,235,1420,229.3L1440,224L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="loginContainer">
          <div className="inputContainer">
            <h2
              style={{
                textAlign: "center",
                fontFamily: "Fredoka One, cursive",
                marginTop: "2em",
              }}
            >
              {" "}
              Signup
            </h2>
            <form onSubmit={handleSubmit} className="verticalFlex">
              <input
                type="text"
                ref={firstNameRef}
                required
                placeholder="First name"
                className="loginInput"
              />
              <input
                type="text"
                ref={lastNameRef}
                required
                placeholder="Last name"
                className="loginInput"
              />
              <input
                type="email"
                ref={emailRef}
                required
                placeholder="Email"
                className="loginInput"
              />
              <input
                type="password"
                ref={passwordRef}
                required
                placeholder="Password"
                className="loginInput"
              />
              <input
                type="password"
                ref={passwordConfirmRef}
                required
                placeholder="Confirm Password"
                className="loginInput"
              />
              <Button
                disabled={loading}
                type="submit"
                style={{
                  width: "75%",
                  margin: "auto",
                  marginTop: "1em",
                  marginBottom: "1em",
                  backgroundColor: "#bd8d46",
                }}
              >
                Signup
              </Button>
            </form>
            {error && (
              <p
                style={{
                  color: "RED",
                  textAlign: "center",
                  marginRight: "15px",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                {error}
              </p>
            )}

            <div
              className="horizontal_flex"
              style={{ margin: "auto", marginTop: "1em", width: "fit-content" }}
            >
              <p
                style={{
                  color: "black",
                  marginRight: "15px",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                Already have an account ?
              </p>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <p
                  style={{ color: "#efac35", fontFamily: "Nunito, sans-serif" }}
                >
                  Log in
                </p>
              </Link>
            </div>
            <div>
              <Link
                to="/forgot-pw"
                style={{
                  textDecoration: "none",
                  color: "#716047",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#716047",
                    textAlign: "center",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  Forgot password ?
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: "50px",
          fontFamily: "Nunito, sans-serif",
          margin: "auto",
          marginTop: "1em",
          color: "#716047",
        }}
      >
        Simple and Elegant crypto trading simulator
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: "20px",
          color: "#766d85",
          fontFamily: "Nunito, sans-serif",
          margin: "2%",
        }}
      >
        Are you afraid to spend real money on coinbase or other cryptocurrency
        trading platform? Want some Dogecoins to play with cryptocurrencies?
      </p>
      <CheckCircleIcon
        style={{
          color: "#bd8d46",
          margin: "auto",
          display: "block",
          fontSize: "100",
        }}
      />

      <p
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontFamily: "Nunito, sans-serif",
          margin: "2%",
        }}
      >
        You can simluate buying, selling and converting top crypto currencies
        like Dogecoin, Bitcoin, Ethereum and more at real-time prices without
        spending real money.
      </p>

      <img className="dashboardPreview" src={appImg} alt="dashboard" />
      <div style={{ backgroundColor: "#ffe3b4", padding: "2%" }}>
        <p
          style={{
            textAlign: "center",
            fontSize: "50px",
            fontFamily: "Nunito, sans-serif",
            margin: "auto",
            marginTop: "1em",
            color: "#716047",
          }}
        >
          Get started in few minutes
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontFamily: "Nunito, sans-serif",
            color: "#766d85",
          }}
        >
          Trade your favorite cryptocurrencies without fear of losing money and
          see how much you can grow your portfolio.
        </p>
        <OfflineBoltIcon
          style={{
            color: "#bd8d46",
            margin: "auto",
            display: "block",
            fontSize: "100",
          }}
        />
        <p
          style={{
            textAlign: "center",
            fontSize: "25px",
            fontWeight: "bold",
            fontFamily: "Nunito, sans-serif",
            margin: "2%",
          }}
        >
          Whether you are an expert or a newbie , or you want to see how much
          you can make from cryptocurrencies or may be just want to try a weird
          portfolio, this trading simulator is for you
        </p>
      </div>
      <img className="dashboardPreview" src={transImg} alt="dashboard" />
      <div style={{ backgroundColor: "#ffe3b4", padding: "2%" }}>
        <p
          style={{
            textAlign: "center",
            fontSize: "50px",
            fontFamily: "Nunito, sans-serif",
            margin: "auto",
            marginTop: "1em",
            color: "#716047",
          }}
        >
          Create your cryptocurrency portfolio today
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            color: "#766d85",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          Dojla has a variety of features that make it the best place to start
          trading.
        </p>
        <AccountBalanceIcon
          style={{
            color: "#bd8d46",
            margin: "auto",
            display: "block",
            fontSize: "100",
          }}
        />

        <p
          style={{
            textAlign: "center",
            fontSize: "25px",
            fontFamily: "Nunito, sans-serif",
            margin: "2%",
          }}
        >
          See detailed transaction history and portfolio.
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: "25px",
            fontFamily: "Nunito, sans-serif",
            margin: "2%",
          }}
        >
          Works responsively on phone and web.
        </p>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: "50px",
          fontFamily: "Nunito, sans-serif",
          margin: "auto",
          marginTop: "1em",
          color: "#716047",
        }}
      >
        Free and secure trades in seconds.
      </p>
      <p
        style={{
          color: "#766d85",
          textAlign: "center",
          fontSize: "20px",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        Buy, sell convert top cryptocurrencies securely and easily.
      </p>
      <LockIcon
        style={{
          color: "#bd8d46",
          margin: "auto",
          display: "block",
          fontSize: "100",
        }}
      />
      <footer style={{ margin: "auto", backgroundColor: "#716047" }}>
        <p style={{ margin: "2em", color: "#ffe3b4" }}>Dojla &#169;</p>
        <p style={{ margin: "2em", color: "#ffe3b4" }}>
          Contact nourishnew@gmail.com for more info
        </p>
      </footer>
    </div>
  );
}
