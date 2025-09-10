import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/api";
import Popup from "../components/Popup"; 

export default function LoanCalculator() {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<any>(null);

  const [principal, setPrincipal] = useState<string>("");
  const [interest, setInterest] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const [emiAmount, setEmiAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false); //  popup state
  const [newLoanId, setNewLoanId] = useState<string | null>(null); //  to navigate after popup

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data));
  }, [customerId]);

  if (!customer) return <p>Loading customer...</p>;

  const calculateEMI = () => {
    setError(null);
    setEmiAmount(null);

    const p = parseFloat(principal);
    const r = interest === "" ? NaN : parseFloat(interest);
    const n = parseInt(duration, 10);

    if (isNaN(p) || p <= 0) {
      setError("Please enter a valid principal amount.");
      return;
    }
    if (isNaN(n) || n <= 0) {
      setError("Please enter a valid duration (months).");
      return;
    }

    const monthlyRate = isNaN(r) ? 0 : r / 100 / 12;

    let emi: number;
    if (monthlyRate === 0) {
      emi = p / n;
    } else {
      emi =
        (p * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);
    }

    setEmiAmount(parseFloat(emi.toFixed(2)));
  };

  const approveLoan = async () => {
    const p = parseFloat(principal);
    const r = interest === "" ? 0 : parseFloat(interest);
    const n = parseInt(duration, 10);

    const res = await fetch(`${API_URL}/loans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: customer._id,
        principal: p,
        interest: r,
        duration: n,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setNewLoanId(data.loanId); //  save loanId for navigation
      setShowPopup(true); // show popup
    } else {
      setError("Failed to approve loan. Try again.");
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (newLoanId) {
      navigate(`/due-table/${newLoanId}`);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Loan Calculator</h2>
      <p className="text-gray-600 mb-4">
        Customer: <span className="font-medium">{customer.name}</span> ({customer.phone})
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Principal</label>
          <input
            type="number"
            placeholder="Enter principal"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interest %</label>
          <input
            type="number"
            placeholder="e.g. 10"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
          <input
            type="number"
            placeholder="e.g. 12"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={calculateEMI}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md"
          >
            Calculate
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {emiAmount !== null && (
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">EMI Summary</h3>
          <p className="text-gray-600">
            {duration} months × <span className="font-medium">₹{emiAmount}</span> per month
          </p>
        </div>
      )}

      {emiAmount !== null && (
        <button
          onClick={approveLoan}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md mt-6"
        >
          Approve Loan
        </button>
      )}

      {/*  Success Popup */}
      {showPopup && (
        <Popup
          title="Loan Approved 🎉"
          message={`The loan has been approved successfully for ${customer.name}.`}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}
