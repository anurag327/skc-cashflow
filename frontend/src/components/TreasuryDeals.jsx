import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function TreasuryDeals() {

  const [deals, setDeals] =
    useState([]);

  const [filters, setFilters] =
    useState({

      employee: "",

      status: "",

      settlement: ""

    });

  const fetchDeals =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/deals"
          );

        setDeals(response.data);

      } catch(error){

        console.log(error);

      }

    };

  useEffect(()=>{

    fetchDeals();

  },[]);

  const filteredDeals =
    deals.filter((item)=>{

      const matchesEmployee =
        item.received_by
          ?.toLowerCase()
          .includes(
            filters.employee.toLowerCase()
          );

      const matchesStatus =
        item.status
          ?.toLowerCase()
          .includes(
            filters.status.toLowerCase()
          );

      const matchesSettlement =
        item.settlement_type
          ?.toLowerCase()
          .includes(
            filters.settlement.toLowerCase()
          );

      return (
        matchesEmployee &&
        matchesStatus &&
        matchesSettlement
      );

    });

  return (

    <div>

      <h1
        style={{
          color:"white",
          marginBottom:"24px"
        }}
      >
        Treasury Deals
      </h1>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap:"16px",

          marginBottom:"24px"
        }}
      >

        <input
          placeholder="Filter Employee"
          value={filters.employee}
          onChange={(e)=>
            setFilters({
              ...filters,
              employee:e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Filter Status"
          value={filters.status}
          onChange={(e)=>
            setFilters({
              ...filters,
              status:e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Filter Settlement"
          value={filters.settlement}
          onChange={(e)=>
            setFilters({
              ...filters,
              settlement:e.target.value
            })
          }
          style={inputStyle}
        />

      </div>

      <div
        style={{
          display:"grid",
          gap:"18px"
        }}
      >

        {filteredDeals.map((item)=>(

          <div
            key={item.id}
            style={cardStyle}
          >

            <div
              style={{
                display:"flex",
                justifyContent:
                  "space-between",

                flexWrap:"wrap",

                gap:"12px"
              }}
            >

              <div>

                <h2
                  style={{
                    color:"white"
                  }}
                >
                  {item.client_name}
                </h2>

                <p style={textStyle}>
                  {item.received_by}
                </p>

              </div>

              <div>

                <h2
                  style={{
                    color:"#facc15"
                  }}
                >
                  AED {item.cash_amount}
                </h2>

              </div>

            </div>

            <div
              style={{
                display:"grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",

                gap:"16px",

                marginTop:"24px"
              }}
            >

              <div>

                <p style={labelStyle}>
                  Settlement Type
                </p>

                <p style={textStyle}>
                  {item.settlement_type}
                </p>

              </div>

              <div>

                <p style={labelStyle}>
                  Status
                </p>

                <p
                  style={{
                    color:"#22c55e"
                  }}
                >
                  {item.status}
                </p>

              </div>

              <div>

                <p style={labelStyle}>
                  Net Profit
                </p>

                <p
                  style={{
                    color:"#22c55e"
                  }}
                >
                  AED {item.net_profit || 0}
                </p>

              </div>

              <div>

                <p style={labelStyle}>
                  Client Receives
                </p>

                <p
                  style={{
                    color:"#facc15"
                  }}
                >
                  AED {item.payout_amount || 0}
                </p>

              </div>

            </div>

          </div>

        ))}

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

const cardStyle = {

  background:"#0b1d1e",

  padding:"24px",

  borderRadius:"20px",

  border:
    "1px solid rgba(255,255,255,0.05)"

};

const labelStyle = {

  color:"#9ca3af"

};

const textStyle = {

  color:"white",

  marginTop:"8px"

};

export default TreasuryDeals;