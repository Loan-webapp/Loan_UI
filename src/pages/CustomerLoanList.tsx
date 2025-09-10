import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/api";

export default function CustomerLoanList() {
  const { customerId } = useParams<{ customerId: string }>();
  const [loans, setLoans] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch customer info
  useEffect(() => {
    fetch(`${API_URL}/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error("Error fetching customer:", err));
  }, [customerId]);

  // Fetch loans
  useEffect(() => {
    fetch(`${API_URL}/loans/customer/${customerId}`)
      .then((res) => res.json())
      .then((data) => setLoans(data))
      .catch((err) => console.error("Error fetching loans:", err));
  }, [customerId]);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Loans</h2>

      {customer ? (
        <h2 className="text-xl font-bold mb-4">
          Loans for <span className="text-blue-600">{customer.name}</span>{" "}
          <span className="text-gray-500 text-sm">({customer.phone})</span>
        </h2>
      ) : (
        <h2 className="text-xl font-bold mb-4">Loading customer...</h2>
      )}

      <button
        onClick={() => navigate(`/calculator/${customerId}`)}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow-md mb-6"
      >
        + New Loan
      </button>

      {loans.length === 0 ? (
        <p className="text-gray-600">No loans found for this customer.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Loan ID</th>
                <th className="px-4 py-3 text-left">Principal</th>
                <th className="px-4 py-3 text-left">Interest %</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono text-gray-700 break-words">{loan._id}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">₹{loan.principal}</td>
                  <td className="px-4 py-3 text-gray-800">{loan.interest}</td>
                  <td className="px-4 py-3 text-gray-800">{loan.duration} months</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/due-table/${loan._id}`)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        View Dues
                      </button>
                      <button
                        onClick={() => navigate(`/payments/${loan._id}`)}
                        className="bg-purple-600 text-white px-2 py-1 rounded"
                      >
                        Payments
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
