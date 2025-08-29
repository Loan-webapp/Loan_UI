import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import API_URL from "../utils/api";

export default function CustomerInfo() {
  const { customers, setCustomers, setSelectedCustomer } = useAppContext();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Fetch customers from backend
  useEffect(() => {
    fetch(`${API_URL}/customers`)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, [setCustomers]);

  const handleAdd = async () => {
    if (!name || !phone) return;
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const newCustomer = await res.json();
      setCustomers([...customers, newCustomer]);
      setName("");
      setPhone("");
    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  const goToCalculator = (id: string) => {
    const customer = customers.find((c) => c._id === id);
    if (customer) {
      setSelectedCustomer(customer);
      navigate(`/loans/${customer._id}`);
    }
  };

  return (
    <div className="p-4">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Info</h2>

  {/* Form */}
  <div className="flex flex-col md:flex-row gap-3 mb-6">
    <input
      type="text"
      placeholder="Name"
      className="flex-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <input
      type="number"
      placeholder="Phone"
      className="flex-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
    <button
      onClick={handleAdd}
      className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg shadow-md"
    >
      Add
    </button>
  </div>

  {/* Table Container */}
  <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
    <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
      <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
        <tr>
          <th className="px-4 py-3 text-left">S.No</th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Phone</th>
          <th className="px-4 py-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {customers.map((c, i) => (
          <tr
            key={c._id}
            className="hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3 font-medium text-gray-700">{i + 1}</td>
            <td className="px-4 py-3">{c.name}</td>
            <td className="px-4 py-3">{c.phone}</td>
            <td className="px-4 py-3 text-center">
              <button
                onClick={() => goToCalculator(c._id!)}
                className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-lg shadow"
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}
