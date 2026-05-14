import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Profile() {

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
      password: ""
    });

  const userId = 1;

  const fetchProfile =
    async () => {

      try {

        const response =
          await axios.get(
            `https://skc-cashflow.onrender.com/user/${userId}`
          );

        setProfile({
          ...response.data,
          password: ""
        });

      } catch (error) {

        console.log(error);

      }

    };

  const updateProfile =
    async () => {

      try {

        await axios.put(
          `https://skc-cashflow.onrender.com/user/${userId}`,
          profile
        );

        alert(
          "Profile updated"
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchProfile();

  }, []);

  return (

    <div
      style={{
        maxWidth: "700px"
      }}
    >

      <h1
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        My Profile
      </h1>

      <div
        style={{
          background: "#0b1d1e",
          padding: "30px",
          borderRadius: "24px",
          border:
            "1px solid rgba(255,255,255,0.05)",
          display: "grid",
          gap: "18px"
        }}
      >

        {[
          ["name", "Name"],
          ["email", "Email"],
          ["mobile", "Mobile"],
          ["whatsapp", "WhatsApp"],
          ["password", "New Password"]
        ].map(([key, label]) => (

          <div key={key}>

            <p
              style={{
                color: "#9ca3af",
                marginBottom: "8px"
              }}
            >
              {label}
            </p>

            <input
              type={
                key === "password"
                  ? "password"
                  : "text"
              }
              value={
                profile[key] || ""
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  [key]:
                    e.target.value
                })
              }
              style={{
                background:
                  "#061314",
                border: "none",
                padding: "14px",
                borderRadius:
                  "12px",
                color: "white",
                width: "100%"
              }}
            />

          </div>

        ))}

        <button
          onClick={updateProfile}
          style={{
            background: "#facc15",
            border: "none",
            padding: "16px",
            borderRadius: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "12px"
          }}
        >
          Update Profile
        </button>

      </div>

    </div>

  );

}

export default Profile;