import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/api";

export default function LoanCalculator() {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<any>(null);
  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emiSchedule, setEmiSchedule] = useState<{ month: number; amount: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data));
  }, [customerId]);

  if (!customer) return <p>Loading customer...</p>;

  const calculateEMI = () => {
    const monthlyRate = interest / 100 / 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1);

    const schedule = Array.from({ length: duration }, (_, i) => ({
      month: i + 1,
      amount: parseFloat(emi.toFixed(2)),
    }));
    setEmiSchedule(schedule);
  };

  const approveLoan = async () => {
    const res = await fetch(`${API_URL}/loans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: customer._id,
        principal,
        interest,
        duration,
      }),
    });
    const data = await res.json();
    navigate(`/due-table/${data.loanId}`);
  };

  return (
 <div className="p-4 md:p-6">
  <h2 className="text-2xl font-bold mb-2 text-gray-800">Loan Calculator</h2>
  <p className="text-gray-600 mb-4">
    Customer: <span className="font-medium">{customer.name}</span> ({customer.phone})
  </p>

  {/* Form with labels */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Principal</label>
      <input
        type="number"
        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={principal}
        onChange={(e) => setPrincipal(Number(e.target.value))}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Interest %</label>
      <input
        type="number"
        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={interest}
        onChange={(e) => setInterest(Number(e.target.value))}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
      <input
        type="number"
        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
    </div>

    <div className="flex items-end">
      <button
        onClick={calculateEMI}
        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg shadow-md"
      >
        Calculate
      </button>
    </div>
  </div>

  {/* EMI Schedule */}
  {emiSchedule.length > 0 && (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
      <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
        <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Month</th>
            <th className="px-4 py-3 text-left">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {emiSchedule.map((row) => (
            <tr key={row.month} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-700">{row.month}</td>
              <td className="px-4 py-3 text-gray-800">₹{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {emiSchedule.length > 0 && (
    <button
      onClick={approveLoan}
      className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg shadow-md mt-6"
    >
      Approve Loan
    </button>
  )}
</div>


  );
}
