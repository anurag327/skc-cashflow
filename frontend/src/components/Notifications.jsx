import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Notifications() {

  const [notifications,
    setNotifications] =
      useState([]);

  const fetchNotifications =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/ledger"
          );

        const data =
          response.data;

        const generated =
          data.map((item) => {

            let message =
              "";

            if (
              item.status ===
              "approved"
            ) {

              message =
                `Transaction of ₹ ${item.amount} approved`;

            } else if (
              item.status ===
              "rejected"
            ) {

              message =
                `Transaction of ₹ ${item.amount} rejected`;

            } else if (
              item.status ===
              "pending"
            ) {

              message =
                `Pending approval for ₹ ${item.amount}`;

            } else if (
              item.status ===
              "delete_requested"
            ) {

              message =
                `Delete requested for ₹ ${item.amount}`;

            } else if (
              item.status ===
              "deleted"
            ) {

              message =
                `Transaction of ₹ ${item.amount} deleted`;

            }

            return {
              id: item.id,
              message,
              status:
                item.status,
              created_at:
                item.created_at
            };

          });

        setNotifications(
          generated
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchNotifications();

  }, []);

  return (

    <div>

      <h1
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        Notifications
      </h1>

      {notifications.map(
        (notification) => (

        <div
          key={notification.id}
          style={{
            background:
              "#0b1d1e",
            padding: "20px",
            borderRadius:
              "18px",
            marginBottom:
              "16px",
            border:
              "1px solid rgba(255,255,255,0.05)"
          }}
        >

          <p
            style={{
              color: "white",
              fontWeight: "500"
            }}
          >
            {
              notification.message
            }
          </p>

          <p
            style={{
              color:
                notification.status ===
                "approved"
                  ? "#22c55e"
                  : notification.status ===
                    "rejected"
                  ? "#ef4444"
                  : notification.status ===
                    "delete_requested"
                  ? "#f97316"
                  : "#facc15",
              marginTop: "8px"
            }}
          >
            {
              notification.status
            }
          </p>

          <p
            style={{
              color: "#9ca3af",
              marginTop: "8px",
              fontSize: "14px"
            }}
          >
            {new Date(
              notification.created_at
            ).toLocaleString()}
          </p>

        </div>

      ))}

    </div>

  );

}

export default Notifications;