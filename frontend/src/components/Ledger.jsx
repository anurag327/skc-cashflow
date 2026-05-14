import React from "react";

function Ledger({ ledger }) {

  const groupedLedger = {};

  ledger.forEach((item) => {

    const date = new Date(
      item.created_at
    ).toLocaleDateString();

    if (!groupedLedger[date]) {
      groupedLedger[date] = [];
    }

    groupedLedger[date].push(item);

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
        Ledger Entries
      </h2>

      {Object.keys(groupedLedger).map((date) => (

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

          <div
            style={{
              overflowX: "auto"
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "white"
              }}
            >

              <thead>

                <tr>

                  {[
                    "From",
                    "To",
                    "Amount",
                    "Status",
                    "Remark"
                  ].map((head) => (

                    <th
                      key={head}
                      style={{
                        textAlign: "left",
                        padding: "14px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.08)",
                        color: "#9ca3af"
                      }}
                    >
                      {head}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {groupedLedger[date].map((item) => (

                  <tr
                    key={item.id}
                  >

                    <td
                      style={{
                        padding: "14px"
                      }}
                    >
                      {item.from_name}
                    </td>

                    <td
                      style={{
                        padding: "14px"
                      }}
                    >
                      {item.to_name}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        color: "#facc15",
                        fontWeight: "bold"
                      }}
                    >
                      ₹ {item.amount}
                    </td>

                    <td
                      style={{
                        padding: "14px"
                      }}
                    >
                      {item.status}
                    </td>

                    <td
                      style={{
                        padding: "14px"
                      }}
                    >
                      {item.remark || "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </details>

      ))}

    </div>

  );

}

export default Ledger;