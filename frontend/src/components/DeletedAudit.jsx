import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function DeletedAudit() {

  const [deleted, setDeleted] =
    useState([]);

  const [filters, setFilters] =
    useState({
      from: "",
      to: "",
      deleted_by: "",
      reason: ""
    });

  const fetchDeleted =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/deleted"
          );

        setDeleted(response.data);

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchDeleted();

  }, []);

  const groupedDeleted = {};

  deleted.forEach((item) => {

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

    const matchesDeletedBy =
      (item.deleted_by || "")
        .toLowerCase()
        .includes(
          filters.deleted_by
            .toLowerCase()
        );

    const matchesReason =
      (item.deleted_reason || "")
        .toLowerCase()
        .includes(
          filters.reason
            .toLowerCase()
        );

    if (
      matchesFrom &&
      matchesTo &&
      matchesDeletedBy &&
      matchesReason
    ) {

      const date = new Date(
        item.deleted_at
      ).toLocaleDateString();

      if (!groupedDeleted[date]) {
        groupedDeleted[date] = [];
      }

      groupedDeleted[date]
        .push(item);

    }

  });

  return (

    <div>

      <h2
        style={{
          color: "white",
          fontSize: "32px",
          marginBottom: "24px"
        }}
      >
        Deleted Audit Log
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
          [
            "deleted_by",
            "Deleted By"
          ],
          [
            "reason",
            "Delete Reason"
          ]
        ].map(([key, label]) => (

          <input
            key={key}
            placeholder={label}
            value={filters[key]}
            onChange={(e) =>
              setFilters({
                ...filters,
                [key]:
                  e.target.value
              })
            }
            style={{
              background:
                "#0b1d1e",
              border: "none",
              padding: "14px",
              borderRadius: "12px",
              color: "white"
            }}
          />

        ))}

      </div>

      {Object.keys(groupedDeleted)
        .map((date) => (

        <details
          key={date}
          open
          style={{
            background:
              "#0b1d1e",
            padding: "24px",
            borderRadius: "20px",
            marginBottom: "20px",
            border:
              "1px solid rgba(255,255,255,0.05)"
          }}
        >

          <summary
            style={{
              color: "#f87171",
              cursor: "pointer",
              fontSize: "20px",
              marginBottom: "20px"
            }}
          >
            {date}
          </summary>

          {groupedDeleted[date]
            .map((item) => (

            <div
              key={item.id}
              style={{
                background:
                  "#061314",
                padding: "20px",
                borderRadius:
                  "16px",
                marginBottom:
                  "16px"
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
                Deleted By:
                {" "}
                {item.deleted_by}
              </p>

            </div>

          ))}

        </details>

      ))}

    </div>

  );

}

export default DeletedAudit;