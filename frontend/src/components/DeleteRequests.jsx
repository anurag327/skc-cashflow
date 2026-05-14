import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function DeleteRequests({
  fetchLedger
}) {

  const [requests, setRequests] =
    useState([]);

  const fetchRequests =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/ledger"
          );

        const filtered =
          response.data.filter(
            (item) =>
              item.status ===
              "delete_requested"
          );

        setRequests(filtered);

      } catch (error) {

        console.log(error);

      }

    };

  const approveDelete =
    async (id) => {

      try {

        await axios.post(
          `https://skc-cashflow.onrender.com/approve-delete/${id}`
        );

        alert(
          "Transaction deleted"
        );

        fetchRequests();

        fetchLedger();

      } catch (error) {

        console.log(error);

      }

    };

  const rejectDelete =
    async (id) => {

      try {

        await axios.post(
          `https://skc-cashflow.onrender.com/reject/${id}`
        );

        alert(
          "Delete request rejected"
        );

        fetchRequests();

        fetchLedger();

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchRequests();

  }, []);

  return (

    <div>

      <h2
        style={{
          color: "white",
          fontSize: "32px",
          marginBottom: "24px"
        }}
      >
        Delete Requests
      </h2>

      {requests.length === 0 && (

        <p
          style={{
            color: "#9ca3af"
          }}
        >
          No delete requests
        </p>

      )}

      {requests.map((item) => (

        <div
          key={item.id}
          style={{
            background: "#0b1d1e",
            padding: "24px",
            borderRadius: "20px",
            marginBottom: "20px",
            border:
              "1px solid rgba(255,255,255,0.05)"
          }}
        >

          <h3
            style={{
              color: "white"
            }}
          >
            ₹ {item.amount}
          </h3>

          <p
            style={{
              color: "#9ca3af",
              marginTop: "8px"
            }}
          >
            {item.from_name}
            {" → "}
            {item.to_name}
          </p>

          <p
            style={{
              color: "#facc15",
              marginTop: "8px"
            }}
          >
            Reason:
            {" "}
            {item.deleted_reason}
          </p>

          <p
            style={{
              color: "#f87171",
              marginTop: "8px"
            }}
          >
            Requested By:
            {" "}
            {item.deleted_by}
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px"
            }}
          >

            <button
              onClick={() =>
                approveDelete(item.id)
              }
              style={{
                background:
                  "#22c55e",
                border: "none",
                padding:
                  "12px 18px",
                borderRadius:
                  "10px",
                color: "white",
                cursor: "pointer"
              }}
            >
              Approve Delete
            </button>

            <button
              onClick={() =>
                rejectDelete(item.id)
              }
              style={{
                background:
                  "#ef4444",
                border: "none",
                padding:
                  "12px 18px",
                borderRadius:
                  "10px",
                color: "white",
                cursor: "pointer"
              }}
            >
              Reject Request
            </button>

          </div>

        </div>

      ))}

    </div>

  );

}

export default DeleteRequests;