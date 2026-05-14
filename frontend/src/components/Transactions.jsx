import React, { useState } from "react";
import axios from "axios";

function Transactions({ fetchLedger }) {

  const [form, setForm] = useState({
    from_name: "",
    to_name: "",
    amount: "",
    remark: "",
    proof: null
  });

  const handleSubmit = async () => {

    try {

      await axios.post(
        "https://skc-cashflow.onrender.com/transaction",
        {
          type: "cash",

          amount: form.amount,

          from_user_id: 1,
          to_user_id: 2,

          from_name: form.from_name,
          to_name: form.to_name,

          remark: form.remark,

          created_by: "Admin",

proof_url:
  form.proof
    ? form.proof.name
    : ""
        }
      );

      alert("Transaction Added");

      setForm({
        from_name: "",
        to_name: "",
        amount: "",
        remark: "",
        proof: null
      });

      fetchLedger();

    } catch (error) {

      console.log(error);

      alert("Transaction failed");

    }

  };

  return (

    <div
      style={{
        background: "#0b1d1e",
        padding: "30px",
        borderRadius: "24px",
        border:
          "1px solid rgba(255,255,255,0.05)"
      }}
    >

      <h2
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        Add Transaction
      </h2>

      <div
        style={{
          display: "grid",
          gap: "16px"
        }}
      >

        <input
          placeholder="From Name"
          value={form.from_name}
          onChange={(e) =>
            setForm({
              ...form,
              from_name: e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="To Name"
          value={form.to_name}
          onChange={(e) =>
            setForm({
              ...form,
              to_name: e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Remark"
          value={form.remark}
          onChange={(e) =>
            setForm({
              ...form,
              remark: e.target.value
            })
          }
          style={inputStyle}
        />

        <input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={(e) =>
    setForm({
      ...form,
      proof: e.target.files[0]
    })
  }
  style={{
    color: "white"
  }}
/>

        <button
          onClick={handleSubmit}
          style={{
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            background: "#facc15",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Save Transaction
        </button>

      </div>

    </div>

  );

}

const inputStyle = {
  background: "#061314",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  color: "white"
};

export default Transactions;