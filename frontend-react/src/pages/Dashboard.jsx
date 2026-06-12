import Navbar from "../components/Navbar";
import StatCard from "../components/StatsCard";
import ExpenseChart from "../components/ExpenseChart";
function Dashboard() {
  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        <div>
          <h1 className="gradient-text">
            Welcome Back 👋
          </h1>

          <p
            style={{
              opacity: 0.7,
              marginTop: "8px"
            }}
          >
            AI Powered Accounting Dashboard
          </p>
        </div>

        <button
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#6366f1",
            color: "white",
            cursor: "pointer"
          }}
        >
          Upgrade Pro 🚀
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px"
        }}
      >
        <StatCard
          title="Documents"
          value="128"
          icon="📄"
        />

        <StatCard
          title="Invoices"
          value="89"
          icon="🧾"
        />

        <StatCard
          title="GST Records"
          value="45"
          icon="📊"
        />

        <StatCard
          title="Vendors"
          value="22"
          icon="🏢"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "20px",
          marginTop: "25px"
        }}
      >

        <div
          className="glass"
          style={{
            padding: "25px",
            borderRadius: "20px"
          }}
        >
          <h2>
            Monthly Expense Trend
          </h2>

          <div
            style={{
              height: "250px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6
            }}
          >
            <ExpenseChart />
          </div>
        </div>

        <div
          className="glass"
          style={{
            padding: "25px",
            borderRadius: "20px"
          }}
        >
          <h2>
            AI Insights
          </h2>

          <ul
            style={{
              marginTop: "20px",
              lineHeight: "2"
            }}
          >
            <li>
              GST Expenses up 12%
            </li>

            <li>
              Top Vendor: Amazon
            </li>

            <li>
              Duplicate Invoice Found
            </li>

            <li>
              Tax Saving Opportunity
            </li>
          </ul>
        </div>

      </div>

      <div
        className="glass"
        style={{
          marginTop: "25px",
          padding: "25px",
          borderRadius: "20px"
        }}
      >
        <h2>
          Recent Activity
        </h2>

        <table
          style={{
            width: "100%",
            marginTop: "20px"
          }}
        >
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Vendor</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>INV001</td>
              <td>Amazon</td>
              <td>₹5,200</td>
            </tr>

            <tr>
              <td>INV002</td>
              <td>Flipkart</td>
              <td>₹2,900</td>
            </tr>

            <tr>
              <td>INV003</td>
              <td>Swiggy</td>
              <td>₹890</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;