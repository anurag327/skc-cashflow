import React from "react";

function Ledger({ ledger }) {

  return (

    <div
      style={{
        background: "#0b1d1e",
        padding: "30px",
        borderRadius: "24px",
        border:
          "1px solid rgba(255,255,255,0.05)"
      }}
    >

      <h2
        style={{
          marginBottom: "20px",
          color: "white"
        }}
      >
        Ledger Entries
      </h2>

      {ledger.length === 0 && (

        <p
          style={{
            color: "#9ca3af"
          }}
        >
          No transactions found
        </p>

      )}

      {ledger.map((item) => (

        <div
          key={item.id}
          style={{
            padding: "18px",
            borderBottom:
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
              marginTop: "6px"
            }}
          >
            {item.from_name}
            {" → "}
            {item.to_name}
          </p>

          <p
            style={{
              color: "#facc15",
              marginTop: "6px"
            }}
          >
            {item.status}
          </p>

        </div>

      ))}

    </div>

  );

}

export default Ledger;