import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const VerifyEmailPage = () => {
  const { uid, token } = useParams();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    if (uid && token) {
      verifyEmail(uid, token);
    }
  }, [uid, token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">Verifying your email...</h1>
    </div>
  );
};

export default VerifyEmailPage;
