import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import axios from "axios";

function Deals() {

  const [step, setStep] =
    useState(1);

  const [accounts, setAccounts] =
    useState([]);

  const [deal, setDeal] =
    useState({

      client_name: "",

      cash_amount: "",

      received_by: "",

      proof: null,

      settlement_type: "",

      exchanger_account: "",

      own_account: "",

      client_account: "",

      operational_cost_percentage: "",

      extra_charges: "",

      direct_client_transfer: false,

      client_charge_percentage: "",

      remarks: ""

    });

  const isAdmin = true;

  const fetchAccounts =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/bank-accounts"
          );

        setAccounts(response.data);

      } catch(error){

        console.log(error);

      }

    };

  useEffect(()=>{

    fetchAccounts();

  },[]);

  const calculations =
    useMemo(()=>{

      const cash =
        Number(deal.cash_amount || 0);

      const clientFee =
        Number(
          deal.client_charge_percentage || 0
        );

      const operationalFee =
        Number(
          deal.operational_cost_percentage || 0
        );

      const charges =
        Number(
          deal.extra_charges || 0
        );

      const revenue =
        cash * (clientFee / 100);

      const operationalCost =
        cash * (operationalFee / 100);

      const payout =
        cash - revenue;

      const netProfit =
        revenue - operationalCost - charges;

      return {

        revenue:
          revenue.toFixed(2),

        operationalCost:
          operationalCost.toFixed(2),

        payout:
          payout.toFixed(2),

        netProfit:
          netProfit.toFixed(2)

      };

    },[deal]);

  const createDeal =
    async () => {

      try {

        await axios.post(
          "https://skc-cashflow.onrender.com/deals",
          {
            ...deal,

            revenue:
              calculations.revenue,

            operational_cost:
              calculations.operationalCost,

            payout_amount:
              calculations.payout,

            net_profit:
              calculations.netProfit
          }
        );

        alert("Deal Created");

      } catch(error){

        console.log(error);

        alert("Deal failed");

      }

    };

  const ownAccounts =
    accounts.filter(
      (item)=>item.type === "Own"
    );

  const clientAccounts =
    accounts.filter(
      (item)=>item.type === "Client"
    );

  return (

    <div>

      <h1
        style={{
          color:"white",
          marginBottom:"24px"
        }}
      >
        Treasury Deals Wizard
      </h1>

      <div
        style={{
          display:"flex",
          gap:"12px",
          marginBottom:"30px",
          flexWrap:"wrap"
        }}
      >

        {[1,2,3,4,5].map((item)=>(

          <div
            key={item}
            style={{
              background:
                step >= item
                  ? "#facc15"
                  : "#0b1d1e",

              color:
                step >= item
                  ? "black"
                  : "white",

              padding:"12px 20px",

              borderRadius:"12px",

              fontWeight:"bold"
            }}
          >
            Step {item}
          </div>

        ))}

      </div>
      <div
        style={{
          background:"#0b1d1e",
          padding:"30px",
          borderRadius:"24px",
          border:
            "1px solid rgba(255,255,255,0.05)"
        }}
      >

        {step === 1 && (

          <div
            style={{
              display:"grid",
              gap:"18px"
            }}
          >

            <h2 style={{color:"white"}}>
              Cash Received
            </h2>

            <input
              placeholder="Client Name"
              value={deal.client_name}
              onChange={(e)=>
                setDeal({
                  ...deal,
                  client_name:e.target.value
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Cash Amount"
              value={deal.cash_amount}
              onChange={(e)=>
                setDeal({
                  ...deal,
                  cash_amount:e.target.value
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Received By"
              value={deal.received_by}
              onChange={(e)=>
                setDeal({
                  ...deal,
                  received_by:e.target.value
                })
              }
              style={inputStyle}
            />

            <button
              onClick={()=>setStep(2)}
              style={buttonStyle}
            >
              Next
            </button>

          </div>

        )}

        {step === 2 && (

          <div>

            <h2
              style={{
                color:"white",
                marginBottom:"24px"
              }}
            >
              Settlement Type
            </h2>

            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap:"20px"
              }}
            >

              <div
                onClick={()=>{
                  setDeal({
                    ...deal,
                    settlement_type:
                      "External Transfer"
                  });
                  setStep(3);
                }}
                style={cardStyle}
              >
                <h2 style={{color:"white"}}>
                  External Transfer
                </h2>
              </div>
                            <div
                onClick={()=>{
                  setDeal({
                    ...deal,
                    settlement_type:
                      "Self Deposit"
                  });
                  setStep(3);
                }}
                style={cardStyle}
              >
                <h2 style={{color:"white"}}>
                  Self Deposit
                </h2>
              </div>

            </div>

          </div>

        )}

        {step === 3 && (

          <div
            style={{
              display:"grid",
              gap:"18px"
            }}
          >

            <h2 style={{color:"white"}}>
              Operational Details
            </h2>

            {deal.settlement_type ===
              "External Transfer" && (

              <>

                <select
                  value={deal.exchanger_account}
                  onChange={(e)=>
                    setDeal({
                      ...deal,
                      exchanger_account:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                >

                  <option>
                    Select Exchanger / Client Account
                  </option>

                  {clientAccounts.map((item)=>(

                    <option
                      key={item.id}
                      value={item.account_name}
                    >
                      {item.account_name}
                    </option>

                  ))}

                </select>

                <input
                  placeholder="Operational Cost %"
                  value={deal.operational_cost_percentage}
                  onChange={(e)=>
                    setDeal({
                      ...deal,
                      operational_cost_percentage:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                />

                <input
                  placeholder="Extra Charges"
                  value={deal.extra_charges}
                  onChange={(e)=>
                    setDeal({
                      ...deal,
                      extra_charges:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                />

                <label style={{color:"white"}}>

                  <input
                    type="checkbox"
                    checked={deal.direct_client_transfer}
                    onChange={(e)=>
                      setDeal({
                        ...deal,
                        direct_client_transfer:
                          e.target.checked
                      })
                    }
                  />

                  {" "}
                  Direct Client Transfer

                </label>

                {!deal.direct_client_transfer && (

                  <select
                    value={deal.own_account}
                    onChange={(e)=>
                      setDeal({
                        ...deal,
                        own_account:
                          e.target.value
                      })
                    }
                    style={inputStyle}
                  >

                    <option>
                      Funds Received In Which Own Account?
                    </option>

                    {ownAccounts.map((item)=>(

                      <option
                        key={item.id}
                        value={item.account_name}
                      >
                        {item.account_name}
                      </option>

                    ))}

                  </select>

                )}

              </>

            )}

            {deal.settlement_type ===
              "Self Deposit" && (

              <>

                <select
                  value={deal.own_account}
                  onChange={(e)=>
                    setDeal({
                      ...deal,
                      own_account:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                >

                  <option>
                    Select Deposit Account
                  </option>

                  {ownAccounts.map((item)=>(

                    <option
                      key={item.id}
                      value={item.account_name}
                    >
                      {item.account_name}
                    </option>

                  ))}

                </select>

                <input
                  placeholder="Deposit Charges"
                  value={deal.extra_charges}
                  onChange={(e)=>
                    setDeal({
                      ...deal,
                      extra_charges:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                />

              </>

            )}

            <button
              onClick={()=>setStep(4)}
              style={buttonStyle}
            >
              Continue
            </button>

          </div>

        )}

        {step === 4 && isAdmin && (

          <div
            style={{
              display:"grid",
              gap:"18px"
            }}
          >

            <h2 style={{color:"white"}}>
              Admin Settlement
            </h2>

            <input
              placeholder="Client Charge %"
              value={deal.client_charge_percentage}
              onChange={(e)=>
                setDeal({
                  ...deal,
                  client_charge_percentage:
                    e.target.value
                })
              }
              style={inputStyle}
            />

            <select
              value={deal.client_account}
              onChange={(e)=>
                setDeal({
                  ...deal,
                  client_account:
                    e.target.value
                })
              }
              style={inputStyle}
            >

              <option>
                Select Client Transfer Account
              </option>

              {clientAccounts.map((item)=>(

                <option
                  key={item.id}
                  value={item.account_name}
                >
                  {item.account_name}
                </option>

              ))}

            </select>

            <textarea
              placeholder="Remarks"
              value={deal.remarks}
              onChange={(e)=>
                setDeal({
                  ...deal,
                  remarks:e.target.value
                })
              }
              style={{
                ...inputStyle,
                minHeight:"120px"
              }}
            />

            <button
              onClick={()=>setStep(5)}
              style={buttonStyle}
            >
              Review Summary
            </button>

          </div>

        )}

        {step === 5 && (

          <div>

            <h2
              style={{
                color:"white",
                marginBottom:"24px"
              }}
            >
              Deal Summary
            </h2>

            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap:"20px"
              }}
            >

              <div style={summaryStyle}>
                <p style={labelStyle}>
                  Revenue
                </p>
                <h2 style={valueStyle}>
                  AED {calculations.revenue}
                </h2>
              </div>

              <div style={summaryStyle}>
                <p style={labelStyle}>
                  Operational Cost
                </p>
                <h2 style={valueStyle}>
                  AED {calculations.operationalCost}
                </h2>
              </div>

              <div style={summaryStyle}>
                <p style={labelStyle}>
                  Client Receives
                </p>
                <h2 style={valueStyle}>
                  AED {calculations.payout}
                </h2>
              </div>

              <div style={summaryStyle}>
                <p style={labelStyle}>
                  Net Profit
                </p>
                <h2 style={valueStyle}>
                  AED {calculations.netProfit}
                </h2>
              </div>

            </div>

            <button
              onClick={createDeal}
              style={{
                ...buttonStyle,
                marginTop:"30px"
              }}
            >
              Create Treasury Deal
            </button>

          </div>

        )}

      </div>

    </div>

  );

}

const inputStyle = {

  background:"#061314",

  border:"none",

  padding:"14px",

  borderRadius:"12px",

  color:"white",

  width:"100%"

};

const buttonStyle = {

  background:"#facc15",

  border:"none",

  padding:"16px",

  borderRadius:"14px",

  fontWeight:"bold",

  cursor:"pointer"

};

const cardStyle = {

  background:"#061314",

  padding:"40px",

  borderRadius:"20px",

  cursor:"pointer",

  border:
    "1px solid rgba(255,255,255,0.05)"

};

const summaryStyle = {

  background:"#061314",

  padding:"24px",

  borderRadius:"20px"

};

const labelStyle = {

  color:"#9ca3af"

};

const valueStyle = {

  color:"#22c55e",

  marginTop:"10px"

};
export default Deals;