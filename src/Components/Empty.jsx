import React from "react";
import Lottie from "lottie-react";
import emptyWishlist from "../assets/empty.json";

const Empty= ({ message = "Your wishlist is empty." }) => {
  return (
    <div className="text-center max-w-sm mx-auto mt-6">
      <Lottie animationData={emptyWishlist} loop={true} />
      <p className="text-gray-600 text-lg mt-4">{message}</p>
    </div>
  );
};

export default Empty;
