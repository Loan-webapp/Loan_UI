import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-lg">
          <Link to="/" className="hover:underline">Loan Manager</Link>
        </h1>
        <div className="space-x-4">
           <h6
      className="cursor-pointer text-white "
      onClick={() => navigate(-1)} // 👈 goes one step back
    >
      Back
    </h6>
          {/* <Link to="/" className="hover:underline">Customers</Link> */}
          {/* <Link to="/calculator" className="hover:underline">Calculator</Link>
          <Link to="/due-table" className="hover:underline">Due Table</Link> */}
        </div>
      </div>
    </nav>
  );
}
