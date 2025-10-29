import React from "react";
import Home from "./home/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Courses from "./courses/Courses";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import Checkout from "./components/Checkout";
import Cart from './components/Cart';
import Payment from "./components/Payment";
import OrderTracking from "./components/OrderTracking";
import UserProfile from "./components/Userprofile";
import OrderSummary from "./components/OrderSummary";
import OrderPage from "./components/OrderPage";
import OrderedItems from "./components/OrderedItems"; // Adjust the path as needed
import SearchResults from "./components/SearchResults";
import ReviewPage from "./components/ReviewPage";
import BookDetail from "./components/BookDetail";



function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/course"
            element={authUser ? <Courses /> : <Navigate to="/signup" />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/profile" element={<UserProfile />} />
           <Route path="/order-summary" element={<OrderSummary />} />
           <Route path="/orders" element={<OrderPage />} />
           <Route path="/ordered-items" element={<OrderedItems />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/book/:id" element={<BookDetail />} />

        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
