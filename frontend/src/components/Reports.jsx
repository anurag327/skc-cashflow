import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Reports() {

  const [ledger, setLedger] =
    useState([]);

  const [vat, setVat] =
    useState({
      taxable: 0,
      vat: 0,
      total: 0
    });

  const fetchReports =
    async () => {

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/ledger"
          );

        const data =
          response.data.filter(
            (item) =>
              item.status ===
              "approved"
          );

        setLedger(data);

        const taxable =
          data.reduce(
            (sum, item) =>
              sum +
              Number(item.amount),
            0
          );

        const vatAmount =
          taxable * 0.05;

        setVat({
          taxable,
          vat: vatAmount,
          total:
            taxable +
            vatAmount
        });

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchReports();

  }, []);

  const exportCSV = () => {

    const headers = [
      "From",
      "To",
      "Amount",
      "Status",
      "Remark"
    ];

    const rows =
      ledger.map((item) => [

        item.from_name,

        item.to_name,

        item.amount,

        item.status,

        item.remark

      ]);

    const csvContent =
      [
        headers,
        ...rows
      ]
        .map((e) =>
          e.join(",")
        )
        .join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;"
        }
      );

    const link =
      document.createElement(
        "a"
      );

    link.href =
      URL.createObjectURL(
        blob
      );

    link.download =
      "ledger-report.csv";

    link.click();

  };

  return (

    <div>

      <h1
        style={{
          color: "white",
          marginBottom: "24px"
        }}
      >
        Reports & VAT Center
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "30px"
        }}
      >

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            Taxable Amount
          </p>

          <h2
            style={{
              color: "white",
              marginTop: "10px"
            }}
          >
            ₹ {vat.taxable}
          </h2>

        </div>

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            UAE VAT (5%)
          </p>

          <h2
            style={{
              color: "#22c55e",
              marginTop: "10px"
            }}
          >
            ₹ {vat.vat}
          </h2>

        </div>

        <div style={cardStyle}>

          <p
            style={{
              color: "#9ca3af"
            }}
          >
            Total Including VAT
          </p>

          <h2
            style={{
              color: "#facc15",
              marginTop: "10px"
            }}
          >
            ₹ {vat.total}
          </h2>

        </div>

      </div>

      <div
        style={{
          background: "#0b1d1e",
          padding: "24px",
          borderRadius: "20px",
          marginBottom: "30px",
          border:
            "1px solid rgba(255,255,255,0.05)"
        }}
      >

        <h2
          style={{
            color: "white",
            marginBottom: "20px"
          }}
        >
          Export Reports
        </h2>

        <button
          onClick={exportCSV}
          style={{
            background: "#facc15",
            border: "none",
            padding: "14px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Export Ledger CSV
        </button>

      </div>

      <div
        style={{
          background: "#0b1d1e",
          padding: "24px",
          borderRadius: "20px",
          border:
            "1px solid rgba(255,255,255,0.05)"
        }}
      >

        <h2
          style={{
            color: "white",
            marginBottom: "20px"
          }}
        >
          Import Statements &
          Receipts
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls,.pdf,image/*"
          style={{
            color: "white"
          }}
        />

        <p
          style={{
            color: "#9ca3af",
            marginTop: "14px"
          }}
        >
          Upload:
          Excel,
          PDF bank statement,
          receipt image,
          or VAT files.
        </p>

      </div>

    </div>

  );

}

const cardStyle = {
  background: "#0b1d1e",
  padding: "24px",
  borderRadius: "20px",
  border:
    "1px solid rgba(255,255,255,0.05)"
};

export default Reports;