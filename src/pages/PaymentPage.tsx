import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API_URL from "../utils/api";
import Popup from "../components/Popup";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentPage() {
  const { loanId } = useParams<{ loanId: string }>();
  const query = useQuery();
  const dueId = query.get("dueId"); 
  const [loan, setLoan] = useState<any>(null);
  const [selectedDues, setSelectedDues] = useState<string[]>([]);
  const [method, setMethod] = useState("Cash");
  const [paymentOption, setPaymentOption] = useState("single");
  const [discount, setDiscount] = useState<number>(0); 
  const navigate = useNavigate();
  const [popup, setPopup] = useState<{ title: string; message: string } | null>(
    null
  );

  useEffect(() => {
    fetch(`${API_URL}/loans/${loanId}`)
      .then((res) => res.json())
      .then((data) => {
        const loanData = data.loan || data;
        setLoan(loanData);

        if (dueId && loanData.dues) {
          const found = loanData.dues.find((d: any) => d._id === dueId);
          if (found) {
            setSelectedDues([found._id]);
          }
        }
        else if (!dueId && loanData.dues && paymentOption === "single") {
    // Auto-select this month's unpaid due on initial load
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonthDue = loanData.dues.find((d: any) => {
      const dDate = new Date(d.dueDate);
      return (
        d.status === "Unpaid" &&
        dDate.getMonth() === currentMonth &&
        dDate.getFullYear() === currentYear
      );
    });
    setSelectedDues(thisMonthDue ? [thisMonthDue._id] : []);
  }
      })
      .catch((err) => console.error("Error fetching loan:", err));
  }, [loanId, dueId, paymentOption]);

  const handleOptionChange = (option: string) => {
    setPaymentOption(option);
    setDiscount(0); // reset discount when option changes
    if (!loan) return;

    if (option === "single") {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonthDue = loan.dues.find((d: any) => {
        const dDate = new Date(d.dueDate);
        return (
          d.status === "Unpaid" &&
          dDate.getMonth() === currentMonth &&
          dDate.getFullYear() === currentYear
        );
      });
      setSelectedDues(thisMonthDue ? [thisMonthDue._id] : []);
    } else if (option === "settlement") {
      const allPending = loan.dues
        .filter((d: any) => d.status === "Unpaid")
        .map((d: any) => d._id);
      setSelectedDues(allPending);
    } else {
      setSelectedDues([]);
    }
  };

  const toggleDue = (dueId: string) => {
    setSelectedDues((prev) =>
      prev.includes(dueId)
        ? prev.filter((id) => id !== dueId)
        : [...prev, dueId]
    );
  };

  //  Auto calculate total amount when dues are selected
  const totalAmount = loan
    ? loan.dues
        .filter((d: any) => selectedDues.includes(d._id))
        .reduce((sum: number, d: any) => sum + d.dueAmount, 0)
    : 0;

  //  Settlement final amount = total - discount
  const finalAmount =
    paymentOption === "settlement"
      ? Math.max(totalAmount - discount, 0)
      : totalAmount;

  const handlePay = async () => {
    if (!selectedDues.length) {
      alert("Please select dues to pay.");
      return;
    }

    const transactionId = "TXN" + Date.now();

    const res = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanId,
        transactionId,
        method,
        amount: finalAmount, 
        type: paymentOption,
        count: selectedDues.length,
        dues: selectedDues,
        discount: paymentOption === "settlement" ? discount : 0,
      }),
    });

    if (res.ok) {
      setPopup({
        title: "Payment Successful 🎉",
        message: `Your payment of ₹${finalAmount.toFixed(
          2
        )} has been completed successfully!`,
      });
    } else {
      setPopup({
        title: "Payment Failed ❌",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  if (!loan) return <p>Loading...</p>;

  //  Filter dues if dueId exists
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filteredDues = (() => {
    if (dueId) {
      return loan.dues.filter((d: any) => d._id === dueId);
    }
    if (paymentOption === "single") {
      return loan.dues.filter((d: any) => {
        const dDate = new Date(d.dueDate);
        return (
          d.status === "Unpaid" &&
          dDate.getMonth() === currentMonth &&
          dDate.getFullYear() === currentYear
        );
      });
    }
    if (paymentOption === "multiple" || paymentOption === "settlement") {
      return loan.dues.filter((d: any) => d.status === "Unpaid");
    }
    return loan.dues;
  })();

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Payments</h2>
      <h3 className="text-lg font-semibold mb-2">
        Loan: ₹{loan.principal} @ {loan.interest}%
      </h3>

      {!dueId && (
        <div className="mb-4">
          <label className="font-semibold">Choose Payment Type:</label>
          <div className="flex gap-4 mt-2">
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="single"
                checked={paymentOption === "single"}
                onChange={() => handleOptionChange("single")}
              />
              <span className="ml-2">This Month EMI</span>
            </label>
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="multiple"
                checked={paymentOption === "multiple"}
                onChange={() => handleOptionChange("multiple")}
              />
              <span className="ml-2">Select Multiple Months</span>
            </label>
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="settlement"
                checked={paymentOption === "settlement"}
                onChange={() => handleOptionChange("settlement")}
              />
              <span className="ml-2">All Pending Dues (Settlement)</span>
            </label>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2">Dues</h4>
        {filteredDues.length === 0 ? (
          <p className="text-gray-500">No dues found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredDues.map((due: any) => (
              <li
                key={due._id}
                className="flex items-center justify-between py-2"
              >
                <label className="flex items-center gap-2">
                  {due.status === "Unpaid" &&
                    paymentOption === "multiple" &&
                    !dueId && (
                      <input
                        type="checkbox"
                        checked={selectedDues.includes(due._id)}
                        onChange={() => toggleDue(due._id)}
                      />
                    )}
                  <span>
                    {new Date(due.dueDate).toLocaleDateString()} – ₹
                    {due.dueAmount} ({due.status})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Summary */}
      {selectedDues.length > 0 && (
        <div className="bg-gray-100 p-3 rounded-lg mb-4 text-gray-800">
          <p className="font-medium">
            Selected EMIs:{" "}
            <span className="text-purple-700">{selectedDues.length}</span>
          </p>
          <p className="font-medium">
            Total Amount:{" "}
            <span className="text-green-600 font-bold">
              ₹{totalAmount.toFixed(2)}
            </span>
          </p>

          {/*  Show discount only in settlement */}
          {paymentOption === "settlement" && (
            <div className="mt-3">
              <label className="font-medium text-gray-700">
                Discount Amount:
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="ml-2 border px-2 py-1 rounded"
                placeholder="Enter discount"
                min={0}
                max={totalAmount}
              />
              <p className="mt-2 font-semibold text-blue-700">
                Final Settlement Amount:{" "}
                <span className="text-green-700 font-bold">
                  ₹{finalAmount.toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="font-semibold">Payment Method:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="ml-2 border rounded px-2 py-1"
        >
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Bank">Bank Transfer</option>
        </select>
      </div>

      <button
        onClick={handlePay}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow"
      >
        {finalAmount > 0
          ? `Pay ₹${finalAmount.toFixed(2)}`
          : "Pay Now"}
      </button>

      {popup && (
        <Popup
          title={popup.title}
          message={popup.message}
          onClose={() => {
            setPopup(null);
            if (popup.title.includes("Successful")) {
              navigate(`/loans/${loan.customer}`);
            }
          }}
        />
      )}
    </div>
  );
}
