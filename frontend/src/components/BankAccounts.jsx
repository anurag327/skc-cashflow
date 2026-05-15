import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function BankAccounts() {

  const [accounts, setAccounts] =
    useState([]);

  const [form, setForm] =
    useState({

      account_name: "",

      account_holder_name: "",

      account_number: "",

      iban_number: "",

      bank_name: "",

      type: "Own"

    });

  const fetchAccounts =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/bank-accounts"
          );

        setAccounts(response.data);

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchAccounts();

  }, []);

  const saveAccount =
    async () => {

      try {

        await axios.post(
          "https://skc-cashflow.onrender.com/bank-accounts",
          form
        );

        alert("Bank Account Added");

        setForm({

          account_name: "",

          account_holder_name: "",

          account_number: "",

          iban_number: "",

          bank_name: "",

          type: "Own"

        });

        fetchAccounts();

      } catch (error) {

        console.log(error);

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
        Bank Master
      </h1>

      <div
        style={{
          background: "#0b1d1e",
          padding: "30px",
          borderRadius: "24px",
          border:
            "1px solid rgba(255,255,255,0.05)",
          display: "grid",
          gap: "18px",
          marginBottom: "30px"
        }}
      >

        <input
          placeholder="Account Name"
          value={form.account_name}
          onChange={(e)=>
            setForm({
              ...form,
              account_name:e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Account Holder Name"
          value={form.account_holder_name}
          onChange={(e)=>
            setForm({
              ...form,
              account_holder_name:e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Account Number"
          value={form.account_number}
          onChange={(e)=>
            setForm({
              ...form,
              account_number:e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="IBAN Number"
          value={form.iban_number}
          onChange={(e)=>
            setForm({
              ...form,
              iban_number:e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Bank Name"
          value={form.bank_name}
          onChange={(e)=>
            setForm({
              ...form,
              bank_name:e.target.value
            })
          }
          style={inputStyle}
        />

        <select
          value={form.type}
          onChange={(e)=>
            setForm({
              ...form,
              type:e.target.value
            })
          }
          style={inputStyle}
        >

          <option value="Own">
            Own
          </option>

          <option value="Client">
            Client
          </option>

        </select>

        <button
          onClick={saveAccount}
          style={buttonStyle}
        >
          Save Account
        </button>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "20px"
        }}
      >

        {accounts.map((item) => (

          <div
            key={item.id}
            style={cardStyle}
          >

            <h2 style={{color:"white"}}>
              {item.account_name}
            </h2>

            <p style={textStyle}>
              {item.bank_name}
            </p>

            <p style={textStyle}>
              {item.account_holder_name}
            </p>

            <p style={textStyle}>
              {item.account_number}
            </p>

            <p
              style={{
                color:"#facc15",
                marginTop:"10px"
              }}
            >
              {item.type}
            </p>

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

const buttonStyle = {

  background:"#facc15",

  border:"none",

  padding:"16px",

  borderRadius:"14px",

  fontWeight:"bold",

  cursor:"pointer"

};

const cardStyle = {

  background:"#0b1d1e",

  padding:"24px",

  borderRadius:"20px",

  border:
    "1px solid rgba(255,255,255,0.05)"

};

const textStyle = {

  color:"#9ca3af",

  marginTop:"8px"

};

export default BankAccounts;