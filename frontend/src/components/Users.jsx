import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Users() {

  const [users, setUsers] =
    useState([]);

  const [balances, setBalances] =
    useState({});

  const [search, setSearch] =
    useState("");

  const fetchUsers =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/users"
          );

        setUsers(response.data);

        response.data.forEach(
          async (user) => {

            const balanceResponse =
              await axios.get(
                `https://skc-cashflow.onrender.com/balance/${user.id}`
              );

            setBalances(
              (prev) => ({
                ...prev,
                [user.id]:
                  balanceResponse.data
              })
            );

          }
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchUsers();

  }, []);

  const filteredUsers =
    users.filter((user) =>

      user.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  return (

    <div>

      <h1
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        Users & Balances
      </h1>

      <input
        placeholder="Search User"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={{
          background: "#0b1d1e",
          border: "none",
          padding: "14px",
          borderRadius: "12px",
          color: "white",
          width: "100%",
          marginBottom: "24px"
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px"
        }}
      >

        {filteredUsers.map(
          (user) => (

          <div
            key={user.id}
            style={{
              background:
                "#0b1d1e",
              padding: "24px",
              borderRadius:
                "20px",
              border:
                "1px solid rgba(255,255,255,0.05)"
            }}
          >

            <h2
              style={{
                color: "white"
              }}
            >
              {user.name}
            </h2>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px"
              }}
            >
              {user.role}
            </p>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px"
              }}
            >
              {user.email}
            </p>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px"
              }}
            >
              {user.mobile}
            </p>

            <div
              style={{
                marginTop: "20px"
              }}
            >

              <p
                style={{
                  color: "#22c55e"
                }}
              >
                Received:
                {" "}
                ₹ {
                  balances[user.id]
                    ?.received || 0
                }
              </p>

              <p
                style={{
                  color: "#ef4444",
                  marginTop: "8px"
                }}
              >
                Given:
                {" "}
                ₹ {
                  balances[user.id]
                    ?.given || 0
                }
              </p>

              <p
                style={{
                  color: "#facc15",
                  marginTop: "8px",
                  fontWeight: "bold"
                }}
              >
                Balance:
                {" "}
                ₹ {
                  balances[user.id]
                    ?.balance || 0
                }
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Users;