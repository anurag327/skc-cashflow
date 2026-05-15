import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Ledger from "./components/Ledger";
import Transactions from "./components/Transactions";
import Pending from "./components/Pending";
import DeleteRequests from "./components/DeleteRequests";
import DeletedAudit from "./components/DeletedAudit";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Deals from "./components/Deals";
import BankAccounts from "./components/BankAccounts";
import TreasuryDeals from "./components/TreasuryDeals";

function App() {

const [started, setStarted] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);
const [activePage, setActivePage] = useState("Dashboard");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [ledger, setLedger] = useState([]);
const [holdings, setHoldings] =
  useState([]);

const handleLogin = async () => {

  try {

const response = await axios.post(
  "https://skc-cashflow.onrender.com/login",
  {
    username,
    password
  }
);

    console.log(response.data);

    setLoggedIn(true);

  } catch (error) {

    alert("Invalid login");

    console.log(error);

  }

};

const fetchLedger = async () => {

  try {

    const response = await axios.get(
      "https://skc-cashflow.onrender.com/ledger"
    );

    setLedger(response.data);

  } catch (error) {

    console.log(error);

  }

};

const fetchHoldings =
  async () => {

    try {

      const response =
        await axios.get(
          "https://skc-cashflow.onrender.com/employee-holdings"
        );

      setHoldings(response.data);

    } catch(error){

      console.log(error);

    }

  };

useEffect(() => {

  if (loggedIn) {

    fetchLedger();
    fetchHoldings();

  }

}, [loggedIn]);

if (loggedIn) {

return (

<div
  style={{
    background: "#061314",
    minHeight: "100vh",
    display: "flex",
    color: "white",
    fontFamily: "Arial"
  }}
>

 {/* Sidebar */}

<div
  style={{
    width: "280px",
    background: "#0b1d1e",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}
>

<div
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "center"
  }}
>

  <img
    src="/skc-logo.png"
    alt="SKC Logo"
    style={{
      width: "380px",
      maxWidth: "380px",
      objectFit: "contain",
      display: "block",
      margin: "0 auto -60px auto",
    }}
  />

</div>

  <div
    style={{
      width: "100%"
    }}
  >

{[
  "Dashboard",
  "Profile",
  "Deals",
  "Users",
  "Ledger",
  "Pending",
  "Treasury Deals",
  "Transactions",
  "Bank Master",
  "Delete Requests",
  "Deleted Audit",
  "Chat",
  "Reports",
  "Notifications",
  "Settings",
  "Logout"
].map((item) => (

<div
  key={item}
  onClick={() => setActivePage(item)}
    style={{
      padding: "14px 18px",
      marginBottom: "6px",
      borderRadius: "14px",
      background:
        item === activePage
        ? "rgba(250,204,21,0.12)"
        : "transparent",
      color:
        item === activePage
        ? "#facc15"
        : "white",
      cursor: "pointer",
      transition: "0.3s",
      fontSize: "15px"
    }}
  >
    {item}
  </div>

))}

  </div>

</div>

  {/* Main Dashboard */}

  <div
    style={{
      flex: 1,
      padding: "40px"
    }}
  >

    <h1
      style={{
        fontSize: "42px",
        marginBottom: "30px"
      }}
    >
      {activePage}
    </h1>
{activePage === "Dashboard" && (

  <div>

    <h1
      style={{
        color:"white",
        marginBottom:"30px"
      }}
    >
      Treasury Dashboard
    </h1>

    <div
      style={{
        display:"grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(240px,1fr))",

        gap:"20px",

        marginBottom:"30px"
      }}
    >

      <div style={dashboardCard}>
        <p style={dashboardLabel}>
          Total Transactions
        </p>

        <h2 style={dashboardValue}>
          {ledger.length}
        </h2>
      </div>

      <div style={dashboardCard}>
        <p style={dashboardLabel}>
          Pending Approvals
        </p>

        <h2 style={dashboardValue}>
          {
            ledger.filter(
              (item)=>
                item.status === "pending"
            ).length
          }
        </h2>
      </div>

      <div style={dashboardCard}>
        <p style={dashboardLabel}>
          Delete Requests
        </p>

        <h2 style={dashboardValue}>
          {
            ledger.filter(
              (item)=>
                item.delete_requested
            ).length
          }
        </h2>
      </div>

      <div style={dashboardCard}>
        <p style={dashboardLabel}>
          Treasury Deals
        </p>

        <h2 style={dashboardValue}>
          Live
        </h2>
      </div>

    </div>

    <div
      style={{
        background:"#0b1d1e",
        padding:"30px",
        borderRadius:"24px",
        border:
          "1px solid rgba(255,255,255,0.05)"
      }}
    >

      <h2
        style={{
          color:"white",
          marginBottom:"24px"
        }}
      >
        Employee Holdings
      </h2>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap:"20px"
        }}
      >

        {holdings.map((item)=>(

          <div
            key={item.employee_name}
            style={{
              background:"#061314",
              padding:"24px",
              borderRadius:"20px"
            }}
          >

            <p
              style={{
                color:"#9ca3af"
              }}
            >
              {item.employee_name}
            </p>

            <h2
              style={{
                color:"#facc15",
                marginTop:"12px"
              }}
            >
              AED {item.holding || 0}
            </h2>

          </div>

        ))}

      </div>

    </div>

  </div>

)}

{activePage === "Ledger" && (
  <Ledger ledger={ledger} />
)}
{activePage === "Transactions" && (
  <Transactions fetchLedger={fetchLedger} />
)}
{activePage === "Pending" && (
  <Pending fetchLedger={fetchLedger} />
)}
{activePage === "Delete Requests" && (
  <DeleteRequests
    fetchLedger={fetchLedger}
  />
)}
{activePage === "Deleted Audit" && (
  <DeletedAudit />
)}
{activePage === "Dashboard" && (
  <Dashboard />
)}
{activePage === "Users" && (
  <Users />
)}
{activePage === "Profile" && (
  <Profile />
)}
{activePage === "Notifications" && (
  <Notifications />
)}
{activePage === "Reports" && (
  <Reports />
)}
{activePage === "Settings" && (
  <Settings />
)}
{activePage === "Deals" && (
  <Deals />
)}
{activePage === "Bank Master" && (
  <BankAccounts />
)}
{activePage === "Treasury Deals" && (
  <TreasuryDeals />
)}

    </div>

  </div>

);

}

return (

<div
style={{
background: "#061314",
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
flexDirection: "column",
overflow: "hidden",
fontFamily: "Arial"
}}
>

  <img
    src="/skc-logo.png"
    alt="SKC Logo"
    style={{
      width: started ? "650px" : "850px",
      maxWidth: "92%",
      transition: "all 1s ease",
transform: started
  ? "translateY(-220px)"
  : "translateY(0px)",
  position: "relative",
zIndex: "20",
        pointerEvents: "none",
    }}
  />

  {!started && (
<p
  onClick={() => setStarted(true)}
  style={{
        color: "#facc15",
        marginTop: "20px",
        letterSpacing: "5px",
        cursor: "pointer"
      }}
    >
      TAP ANYWHERE
    </p>
  )}

{started && (
  <div
    style={{
      width: "350px",
      maxWidth: "90%",
      marginTop: "-220px",
      position: "relative",
      zIndex: "5",
      pointerEvents: "auto"
    }}
  >

      <input
          placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "16px",
          border: "none",
          background: "#0b1d1e",
          color: "white"
        }}
      />

      <input
         type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "16px",
          border: "none",
          background: "#0b1d1e",
          color: "white"
        }}
      />

<button
onClick={handleLogin}
style={{
width: "100%",
padding: "16px",
borderRadius: "16px",
border: "none",
background: "#facc15",
color: "black",
fontWeight: "bold",
cursor: "pointer",
fontSize: "16px"
}}
      >
        LOGIN
      </button>

    </div>
  )}

</div>

);

}
const dashboardCard = {

  background:"#0b1d1e",

  padding:"24px",

  borderRadius:"20px",

  border:
    "1px solid rgba(255,255,255,0.05)"

};

const dashboardLabel = {

  color:"#9ca3af"

};

const dashboardValue = {

  color:"white",

  marginTop:"12px"

};

export default App;
