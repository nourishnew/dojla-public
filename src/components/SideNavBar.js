import React from "react";
import "../App.scss";
import { useHistory, useLocation } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import PaymentIcon from "@material-ui/icons/Payment";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

function SideNavBar({ logout, open }) {
  const location = useLocation();
  const history = useHistory();

  return (
    <div className="sideNavBar">
      {location.pathname === "/" ? (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            style={{
              color: "#f7f6fd",
              backgroundColor: "white",
              margin: "auto",
              display: "block",
            }}
            size="medium"
          >
            <DashboardIcon
              style={{ backgroundColor: "white", color: "#32297c" }}
            />
          </IconButton>
          <p
            style={{
              color: "#f7f6fd",
              textAlign: "center",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Dashboard
          </p>
        </div>
      ) : (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            size="medium"
            style={{
              color: "#f7f6fd",
              margin: "auto",
              display: "block",
            }}
            onClick={() => {
              history.push("/");
            }}
          >
            <DashboardIcon style={{ backgroundColor: "#32297c" }} />
          </IconButton>
          <p style={{ color: "#f7f6fd", textAlign: "center" }}>Dashboard</p>
        </div>
      )}
      {location.pathname === "/portfolio" ? (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            style={{
              color: "#f7f6fd",
              backgroundColor: "white",
              margin: "auto",
              display: "block",
            }}
            size="medium"
          >
            <AccountBalanceIcon
              style={{ backgroundColor: "white", color: "#32297c" }}
            />
          </IconButton>
          <p
            style={{
              color: "#f7f6fd",
              textAlign: "center",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Portfolio
          </p>
        </div>
      ) : (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            style={{
              color: "#f7f6fd",
              margin: "auto",
              display: "block",
            }}
            onClick={() => {
              history.push("/portfolio");
            }}
          >
            <AccountBalanceIcon style={{ backgroundColor: "#32297c" }} />
          </IconButton>
          <p
            style={{
              color: "#f7f6fd",
              textAlign: "center",
              fontFamily: "Nunito, sans-serif",
            }}
            onClick={() => {
              history.push("/portfolio");
            }}
          >
            Portfolios
          </p>
        </div>
      )}
      {location.pathname === "/trades" ? (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            style={{
              color: "#f7f6fd",
              backgroundColor: "white",
              margin: "auto",
              display: "block",
            }}
            onClick={() => {
              history.push("/trades");
            }}
          >
            <PaymentIcon
              style={{ backgroundColor: "white", color: "#32297c" }}
            />
          </IconButton>
          <p
            style={{ color: "#f7f6fd", textAlign: "center" }}
            onClick={() => {
              history.push("/trades");
            }}
          >
            Trades
          </p>
        </div>
      ) : (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            style={{
              color: "#f7f6fd",
              margin: "auto",
              display: "block",
            }}
            onClick={() => {
              history.push("/trades");
            }}
          >
            <PaymentIcon style={{ backgroundColor: "#32297c" }} />
          </IconButton>
          <p
            style={{
              color: "#f7f6fd",
              textAlign: "center",
              fontFamily: "Nunito, sans-serif",
            }}
            onClick={() => {
              history.push("/trades");
            }}
          >
            Trades
          </p>
        </div>
      )}
      <div style={{ marginTop: "auto" }}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          style={{ color: "#f7f6fd", margin: "auto", display: "block" }}
          onClick={() => {
            logout();
            history.push("/login");
          }}
        >
          <PowerSettingsNewIcon style={{ backgroundColor: "#32297c" }} />
        </IconButton>
        <p
          style={{
            color: "#f7f6fd",
            textAlign: "center",
            fontFamily: "Nunito, sans-serif",
          }}
          onClick={() => {
            logout();
            history.push("/login");
          }}
        >
          Logout
        </p>
      </div>
    </div>
  );
}
export default SideNavBar;
