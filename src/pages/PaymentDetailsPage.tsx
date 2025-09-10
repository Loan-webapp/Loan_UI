import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/api";

export default function PaymentDetailsPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/payments/transaction/${transactionId}`)
      .then((res) => res.json())
      .then((data) => {
        setPayment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching payment:", err);
        setLoading(false);
      });
  }, [transactionId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!payment) return <p className="p-4 text-red-500">Payment not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Payment Details
      </h2>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
        <p><strong>Loan ID:</strong> {payment.loanId?._id || payment.loanId}</p>
        <p><strong>Payment Method:</strong> {payment.method}</p>
        <p><strong>Payment Type:</strong> {payment.type}</p>
        <p><strong>Total Amount:</strong> ₹{payment.amount}</p>
        {payment.discount > 0 && (
          <p className="text-green-600">
            <strong>Discount Applied:</strong> ₹{payment.discount}
          </p>
        )}
        <p><strong>Dues Paid:</strong> {payment.count}</p>
        <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
      </div>

 

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
      >
        Back
      </button>
    </div>
  );
}
