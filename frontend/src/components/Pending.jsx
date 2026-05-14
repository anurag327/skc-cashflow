import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Pending({ fetchLedger }) {

  const [pending, setPending] = useState([]);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    amount: "",
    remark: ""
  });

  const fetchPending = async () => {

    try {

      const response = await axios.get(
        "https://skc-cashflow.onrender.com/pending"
      );

      setPending(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const approveTransaction = async (id) => {

    try {

      await axios.post(
        `https://skc-cashflow.onrender.com/approve/${id}`
      );

      fetchPending();

      fetchLedger();

    } catch (error) {

      console.log(error);

    }

  };

  const rejectTransaction = async (id) => {

  try {

    await axios.post(
      `https://skc-cashflow.onrender.com/reject/${id}`
    );

    fetchPending();

    fetchLedger();

  } catch (error) {

    console.log(error);

  }

};

  useEffect(() => {

    fetchPending();

  }, []);

  const groupedPending = {};

  pending.forEach((item) => {

    const matchesFrom =
      item.from_name
        ?.toLowerCase()
        .includes(
          filters.from.toLowerCase()
        );

    const matchesTo =
      item.to_name
        ?.toLowerCase()
        .includes(
          filters.to.toLowerCase()
        );

    const matchesAmount =
      String(item.amount)
        .includes(filters.amount);

    const matchesRemark =
      (item.remark || "")
        .toLowerCase()
        .includes(
          filters.remark.toLowerCase()
        );

    if (
      matchesFrom &&
      matchesTo &&
      matchesAmount &&
      matchesRemark
    ) {

      const date = new Date(
        item.created_at
      ).toLocaleDateString();

      if (!groupedPending[date]) {
        groupedPending[date] = [];
      }

      groupedPending[date].push(item);

    }

  });

  return (

    <div>

      <h2
        style={{
          color: "white",
          marginBottom: "20px",
          fontSize: "32px"
        }}
      >
        Pending Approvals
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "12px",
          marginBottom: "24px"
        }}
      >

        {[
          ["from", "Filter From"],
          ["to", "Filter To"],
          ["amount", "Filter Amount"],
          ["remark", "Filter Remark"]
        ].map(([key, label]) => (

          <input
            key={key}
            placeholder={label}
            value={filters[key]}
            onChange={(e) =>
              setFilters({
                ...filters,
                [key]: e.target.value
              })
            }
            style={{
              background: "#0b1d1e",
              border: "none",
              padding: "14px",
              borderRadius: "12px",
              color: "white"
            }}
          />

        ))}

      </div>

      {Object.keys(groupedPending).map((date) => (

        <details
          key={date}
          open
          style={{
            marginBottom: "20px",
            background: "#0b1d1e",
            borderRadius: "20px",
            padding: "20px",
            border:
              "1px solid rgba(255,255,255,0.05)"
          }}
        >

          <summary
            style={{
              cursor: "pointer",
              color: "#facc15",
              fontSize: "20px",
              marginBottom: "20px"
            }}
          >
            {date}
          </summary>

          {groupedPending[date].map((item) => (

            <div
              key={item.id}
              style={{
                background: "#061314",
                padding: "20px",
                borderRadius: "16px",
                marginBottom: "16px"
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
                  color: "#9ca3af"
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
                {item.remark}
              </p>

<div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "16px",
    flexWrap: "wrap"
  }}
>

  <button
    onClick={() =>
      approveTransaction(item.id)
    }
    style={{
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      background: "#22c55e",
      color: "white",
      cursor: "pointer"
    }}
  >
    Approve
  </button>

  <button
    onClick={() =>
      rejectTransaction(item.id)
    }
    style={{
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      background: "#ef4444",
      color: "white",
      cursor: "pointer"
    }}
  >
    Reject
  </button>

  <button
    onClick={async () => {

      const confirmDelete =
        window.confirm(
          "Cancel this pending request?"
        );

      if (!confirmDelete) return;

      try {

        await axios.post(
          `https://skc-cashflow.onrender.com/cancel-pending/${item.id}`
        );

        alert(
          "Pending request cancelled"
        );

        fetchPending();

        fetchLedger();

      } catch (error) {

        console.log(error);

      }

    }}
    style={{
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      background: "#6b7280",
      color: "white",
      cursor: "pointer"
    }}
  >
    Delete
  </button>

</div>

            </div>
          ))}

        </details>

      ))}

    </div>

  );

}

export default Pending;