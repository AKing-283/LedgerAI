export default function DashboardCards() {

  return (

    <div className="grid grid-cols-4 gap-6">

      <div className="bg-white p-6 rounded shadow">

        <h3>Total Invoices</h3>

        <p className="text-3xl font-bold">
          152
        </p>

      </div>

      <div className="bg-white p-6 rounded shadow">

        <h3>Total Spend</h3>

        <p className="text-3xl font-bold">
          ₹2.4L
        </p>

      </div>

      <div className="bg-white p-6 rounded shadow">

        <h3>GST Paid</h3>

        <p className="text-3xl font-bold">
          ₹36K
        </p>

      </div>

      <div className="bg-white p-6 rounded shadow">

        <h3>Vendors</h3>

        <p className="text-3xl font-bold">
          48
        </p>

      </div>

    </div>
  );
}