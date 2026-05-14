import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Dashboard() {

  const [stats, setStats] =
    useState({
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      deleteRequests: 0
    });

  const [recent, setRecent] =
    useState([]);

  const fetchDashboard =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/ledger"
          );

        const data =
          response.data;

        const total =
          data.reduce(
            (sum, item) =>
              sum +
              Number(item.amount),
            0
          );

        const approved =
          data
            .filter(
              (item) =>
                item.status ===
                "approved"
            )
            .reduce(
              (sum, item) =>
                sum +
                Number(
                  item.amount
                ),
              0
            );

        const pending =
          data.filter(
            (item) =>
              item.status ===
              "pending"
          ).length;

        const rejected =
          data.filter(
            (item) =>
              item.status ===
              "rejected"
          ).length;

        const deleteRequests =
          data.filter(
            (item) =>
              item.status ===
              "delete_requested"
          ).length;

        setStats({
          total,
          approved,
          pending,
          rejected,
          deleteRequests
        });

        setRecent(
          data.slice(0, 5)
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchDashboard();

  }, []);

  const cardStyle = {
    background: "#0b1d1e",
    padding: "24px",
    borderRadius: "20px",
    border:
      "1px solid rgba(255,255,255,0.05)"
  };

  return (

    <div>

      <h1
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "30px"
        }}
      >

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            Total Transactions
          </p>

          <h2
            style={{
              color: "white",
              marginTop: "10px"
            }}
          >
            ₹ {stats.total}
          </h2>

        </div>

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            Approved Amount
          </p>

          <h2
            style={{
              color: "#22c55e",
              marginTop: "10px"
            }}
          >
            ₹ {stats.approved}
          </h2>

        </div>

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            Pending Requests
          </p>

          <h2
            style={{
              color: "#facc15",
              marginTop: "10px"
            }}
          >
            {stats.pending}
          </h2>

        </div>

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            Rejected Requests
          </p>

          <h2
            style={{
              color: "#ef4444",
              marginTop: "10px"
            }}
          >
            {stats.rejected}
          </h2>

        </div>

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            Delete Requests
          </p>

          <h2
            style={{
              color: "#f97316",
              marginTop: "10px"
            }}
          >
            {stats.deleteRequests}
          </h2>

        </div>

      </div>

      <div
        style={{
          background: "#0b1d1e",
          padding: "24px",
          borderRadius: "20px",
          border:
            "1px solid rgba(255,255,255,0.05)"
        }}
      >

        <h2
          style={{
            color: "white",
            marginBottom: "20px"
          }}
        >
          Recent Activity
        </h2>

        {recent.map((item) => (

          <div
            key={item.id}
            style={{
              padding: "16px 0",
              borderBottom:
                "1px solid rgba(255,255,255,0.05)"
            }}
          >

            <p
              style={{
                color: "white"
              }}
            >
              ₹ {item.amount}
            </p>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "4px"
              }}
            >
              {item.from_name}
              {" → "}
              {item.to_name}
            </p>

            <p
              style={{
                color:
                  item.status ===
                  "approved"
                    ? "#22c55e"
                    : item.status ===
                      "rejected"
                    ? "#ef4444"
                    : "#facc15",
                marginTop: "4px"
              }}
            >
              {item.status}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Dashboard;