import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userInfo, setUserInfo] = useState();
  const [userTrades, setUserTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  function signup(firstName, lastName, email, password) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        return db.collection("users").doc(credentials.user.uid).set({
          firstName: firstName,
          lastName: lastName,
          email: email,
          wallet: 0,
          portfolio: 0,
          DOGE: 100000,
          BTC: 0,
          ETH: 0,
          BNB: 0,
          LTC: 0,
          BCH: 0,
          ADA: 0,
          XRP: 0,
        });
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password).then((res) => {
      return res;
    });
  }
  function logout() {
    return auth.signOut();
  }
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        db.collection("users")
          .doc(user.uid)
          .onSnapshot((doc) => {
            setUserInfo(doc.data());
          });
        db.collection("users")
          .doc(user.uid)
          .collection("transactions")
          .orderBy("createdAt", "desc")
          .onSnapshot((doc) => {
            setUserTrades([]);
            doc.forEach((item) => {
              setUserTrades((prevArray) => [...prevArray, item.data()]);
            });
          });
      } else {
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userInfo,
    userTrades,
    signup,
    login,
    logout,
    resetPassword,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
