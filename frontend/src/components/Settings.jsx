import React, {
  useState
} from "react";

function Settings() {

  const [settings,
    setSettings] =
      useState({

        company:
          "SKC Real Estate",

        trn: "",

        address: "",

        vat: "5",

        currency: "AED",

        fiscalYear:
          "2026",

        approvalRequired:
          true,

        deleteApproval:
          true,

        whatsapp:
          "",

        invoicePrefix:
          "SKC"

      });

  const saveSettings =
    () => {

      localStorage.setItem(
        "erp_settings",

        JSON.stringify(
          settings
        )
      );

      alert(
        "Settings Saved"
      );

    };

  return (

    <div>

      <h1
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        ERP Settings
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
          [
            "company",
            "Company Name"
          ],

          [
            "trn",
            "TRN Number"
          ],

          [
            "address",
            "Company Address"
          ],

          [
            "vat",
            "VAT Percentage"
          ],

          [
            "currency",
            "Currency"
          ],

          [
            "fiscalYear",
            "Fiscal Year"
          ],

          [
            "whatsapp",
            "Admin WhatsApp"
          ],

          [
            "invoicePrefix",
            "Invoice Prefix"
          ]

        ].map(([key,label]) => (

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
              value={
                settings[key]
              }
              onChange={(e)=>

                setSettings({
                  ...settings,

                  [key]:
                    e.target.value
                })

              }
              style={{
                background:
                  "#061314",

                border:
                  "none",

                padding:
                  "14px",

                borderRadius:
                  "12px",

                color:
                  "white",

                width:
                  "100%"
              }}
            />

          </div>

        ))}

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >

          <label
            style={{
              color: "white"
            }}
          >

            <input
              type="checkbox"

              checked={
                settings
                  .approvalRequired
              }

              onChange={(e)=>

                setSettings({
                  ...settings,

                  approvalRequired:
                    e.target.checked
                })

              }
            />

            {" "}
            Approval Required

          </label>

          <label
            style={{
              color: "white"
            }}
          >

            <input
              type="checkbox"

              checked={
                settings
                  .deleteApproval
              }

              onChange={(e)=>

                setSettings({
                  ...settings,

                  deleteApproval:
                    e.target.checked
                })

              }
            />

            {" "}
            Delete Approval Required

          </label>

        </div>

        <button
          onClick={
            saveSettings
          }
          style={{
            background:
              "#facc15",

            border:
              "none",

            padding:
              "16px",

            borderRadius:
              "14px",

            fontWeight:
              "bold",

            cursor:
              "pointer",

            marginTop:
              "12px"
          }}
        >
          Save Settings
        </button>

      </div>

    </div>

  );

}

export default Settings;