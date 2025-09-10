import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import API_URL from "../utils/api";

export default function CustomerInfo() {
  const { customers, setCustomers, setSelectedCustomer } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    contact: "",
    occupation: "",
    income: "",
    dob: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormOpen, setIsFormOpen] = useState(false); // Accordion toggle
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Fetch customers
  useEffect(() => {
    fetch(`${API_URL}/customers`)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, [setCustomers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (form.income && Number(form.income) <= 0)
      newErrors.income = "Income must be greater than 0";
    if (form.dob && new Date(form.dob) > new Date())
      newErrors.dob = "Date of Birth cannot be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add customer");
      const newCustomer = await res.json();
      setCustomers([...customers, newCustomer]);

      setForm({
        name: "",
        phone: "",
        contact: "",
        occupation: "",
        income: "",
        dob: "",
      });
      setErrors({});
      setIsFormOpen(false); // close accordion after success
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

  // Search customers
const handleSearch = (query: string) => {
  fetch(`${API_URL}/customers${query ? `?search=${query}` : ""}`)
    .then((res) => res.json())
    .then((data) => setCustomers(data))
    .catch((err) => console.error("Error searching customers:", err));
};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Info</h2>

      {/* Accordion Header */}
      <div
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="cursor-pointer flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md mb-4"
      >
        <span className="font-semibold">
          {isFormOpen ? "➖ Close Form" : "➕ Add New Customer"}
        </span>
      </div>

      {/* Collapsible Form with transition */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isFormOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={form.name}
                onChange={handleChange}
                className={`border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Phone *</label>
              <input
                type="number"
                name="phone"
                placeholder="Enter phone"
                value={form.phone}
                onChange={handleChange}
                className={`border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Contact</label>
              <input
                type="text"
                name="contact"
                placeholder="Enter contact or address"
                value={form.contact}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Occupation */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Occupation</label>
              <input
                type="text"
                name="occupation"
                placeholder="Enter occupation"
                value={form.occupation}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Income */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">Income</label>
              <input
                type="number"
                name="income"
                placeholder="Enter income"
                value={form.income}
                onChange={handleChange}
                className={`border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.income
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.income && (
                <span className="text-red-500 text-sm">{errors.income}</span>
              )}
            </div>

            {/* DOB */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className={`border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.dob
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.dob && (
                <span className="text-red-500 text-sm">{errors.dob}</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg shadow-md"
            >
              Save Customer
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="flex items-center gap-2 mb-4">
  <div className="relative w-full md:w-1/3">
    <input
      type="text"
      placeholder="Search by name or phone..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-300 p-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    />
    {search && (
      <button
        onClick={() => {
          setSearch("");
          handleSearch(""); // reset list
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-gray-700"
      >
        ✕
      </button>
    )}
  </div>

  <button
    onClick={() => handleSearch(search)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
  >
    Search
  </button>
</div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">S.No</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Occupation</th>
              <th className="px-4 py-3 text-left">Income</th>
              <th className="px-4 py-3 text-left">DOB</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((c, i) => (
              <tr key={c._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-700">{i + 1}</td>
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">{c.occupation || "-"}</td>
                <td className="px-4 py-3">{c.income ? `₹${c.income}` : "-"}</td>
                <td className="px-4 py-3">
                  {c.dob ? new Date(c.dob).toLocaleDateString() : "-"}
                </td>
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
