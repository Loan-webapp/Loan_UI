import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-start items-center">
           <div className="space-x-4 pr-4">
          <h6
            className="cursor-pointer text-white flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            {/* Back Arrow Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            
          </h6>
          {/* <Link to="/" className="hover:underline">Customers</Link> */}
          {/* <Link to="/calculator" className="hover:underline">Calculator</Link>
          <Link to="/due-table" className="hover:underline">Due Table</Link> */}
        </div>
        <h1 className="font-bold text-lg">
          <Link to="/" className="hover:underline">Loan Manager</Link>
        </h1>
     
      </div>
    </nav>
  );
}
