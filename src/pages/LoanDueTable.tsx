import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/api";

export default function LoanDueTable() {
  const { loanId } = useParams<{ loanId: string }>();
  const [dues, setDues] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loanId) return;
    fetch(`${API_URL}/dues/loan/${loanId}`)
      .then((res) => res.json())
      .then((data) => {
        setDues(data);
      })
      .catch((err) => console.error("Error fetching dues:", err));
  }, [loanId]);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Loan Due Table</h2>

      {dues.length === 0 ? (
        <p className="text-gray-600">No dues found for this loan.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">S.No</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dues.map((d, i) => (
                <tr key={d._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-700">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {new Date(d.dueDate).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-3 text-gray-800">₹{d.dueAmount}</td>
                  <td className="p-2 text-center">
                    {d.status === "Paid" ? (
    d.isLate ? (
      <span className="text-red-600 font-bold">Late Payment</span>
    ) : (
      <span className="text-green-600 font-bold">Paid (On Time)</span>
    )
  ) : (
                      <button
                        onClick={() =>
                          navigate(`/payments/${loanId}?dueId=${d._id}`)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                 <td className="px-4 py-3 text-gray-800">
  {d.transactionId ? (
    <button
      className="text-blue-600 underline hover:text-blue-800"
      onClick={() => navigate(`/paymentdetails/${d.transactionId}`)}
    >
      {d.transactionId}
    </button>
  ) : (
    "-"
  )}
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
