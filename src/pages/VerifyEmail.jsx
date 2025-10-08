// src/pages/VerifyEmail.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const { uid, token } = useParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(uid, token);
        navigate("/login");
      } catch (err) {
        console.error(err);
      }
    };
    verify();
  }, [uid, token, verifyEmail, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-lg font-bold">Verifying your email...</h2>
    </div>
  );
};

export default VerifyEmail;
