import axios from "axios";
import React, {
  useMemo,
  useState
} from "react";

function Deals() {

  const [deal, setDeal] =
    useState({

      client_name: "",

      cash_holder: "",

      cash_amount: "",

      fee_percentage: "",

      charges: "",

      bank_used: "",

      transfer_account: "",

      remarks: ""

    });

  const calculations =
    useMemo(() => {

      const cash =
        Number(
          deal.cash_amount || 0
        );

      const fee =
        Number(
          deal.fee_percentage || 0
        );

      const charges =
        Number(
          deal.charges || 0
        );

      const grossProfit =
        cash * (fee / 100);

      const payable =
        cash - grossProfit;

      const netProfit =
        grossProfit - charges;

      return {

        grossProfit:
          grossProfit.toFixed(2),

        payable:
          payable.toFixed(2),

        netProfit:
          netProfit.toFixed(2)

      };

    }, [deal]);

  const saveDeal =
  async () => {

    try {

      await axios.post(

        "https://skc-cashflow.onrender.com/deals",

        {

          ...deal,

          gross_profit:
            calculations
              .grossProfit,

          payable_amount:
            calculations
              .payable,

          net_profit:
            calculations
              .netProfit

        }

      );

      alert(
        "Deal Created"
      );

      setDeal({

        client_name: "",

        cash_holder: "",

        cash_amount: "",

        fee_percentage: "",

        charges: "",

        bank_used: "",

        transfer_account: "",

        remarks: ""

      });

    } catch(error){

      console.log(error);

      alert(
        "Deal failed"
      );

    }

  };

  return (

    <div>

      <h1
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        Treasury Deals
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
            "client_name",
            "Client Name"
          ],

          [
            "cash_holder",
            "Cash Holder"
          ],

          [
            "cash_amount",
            "Cash Amount"
          ],

          [
            "fee_percentage",
            "Fee Percentage"
          ],

          [
            "charges",
            "Bank / Transfer Charges"
          ],

          [
            "bank_used",
            "Bank Used"
          ],

          [
            "transfer_account",
            "Transfer Account"
          ],

          [
            "remarks",
            "Remarks"
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
              value={deal[key]}

              onChange={(e)=>

                setDeal({
                  ...deal,

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
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",

            gap: "18px",

            marginTop: "10px"
          }}
        >

          <div style={cardStyle}>

            <p
              style={{
                color: "#9ca3af"
              }}
            >
              Gross Profit
            </p>

            <h2
              style={{
                color: "#22c55e",

                marginTop: "10px"
              }}
            >
              AED {
                calculations
                  .grossProfit
              }
            </h2>

          </div>

          <div style={cardStyle}>

            <p
              style={{
                color: "#9ca3af"
              }}
            >
              Payable Amount
            </p>

            <h2
              style={{
                color: "#facc15",

                marginTop: "10px"
              }}
            >
              AED {
                calculations
                  .payable
              }
            </h2>

          </div>

          <div style={cardStyle}>

            <p
              style={{
                color: "#9ca3af"
              }}
            >
              Net Profit
            </p>

            <h2
              style={{
                color: "#22c55e",

                marginTop: "10px"
              }}
            >
              AED {
                calculations
                  .netProfit
              }
            </h2>

          </div>

        </div>

        <button
          onClick={saveDeal}

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
          Create Deal
        </button>

      </div>

    </div>

  );

}

const cardStyle = {

  background: "#061314",

  padding: "24px",

  borderRadius: "18px"

};

export default Deals;