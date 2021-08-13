import "../App.scss";
import Signup from "./Signup";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import Portfolio from "./Portfolio";
import Transactions from "./Transactions";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={Signup} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-pw" component={ForgotPassword} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/trades" component={Transactions} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}
export default App;
