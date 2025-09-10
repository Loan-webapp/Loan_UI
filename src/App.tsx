import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerInfo from './pages/CustomerInfo';
import LoanCalculator from './pages/LoanCalculator';
import LoanDueTable from './pages/LoanDueTable';
import CustomerLoanList from './pages/CustomerLoanList';
import PaymentPage from './pages/PaymentPage';
import PaymentDetailsPage from './pages/PaymentDetailsPage';
 
function App() {
  return (
     <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<CustomerInfo />} />
          <Route path="/loans/:customerId" element={<CustomerLoanList />} />
<Route path="/calculator/:customerId" element={<LoanCalculator />} />
<Route path="/due-table/:loanId" element={<LoanDueTable />} />
     <Route path="/payments/:loanId" element={<PaymentPage />} />
          <Route path="/paymentdetails/:transactionId" element={<PaymentDetailsPage />} />

        </Routes>
   

      </div>
    </div>
  );
}

export default App;
