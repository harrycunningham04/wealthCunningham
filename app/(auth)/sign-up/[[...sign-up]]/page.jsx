import { SignUp } from "@clerk/nextjs";
import React from "react";
import { useRouter } from "next/router";

const page = () => {
  const router = useRouter();

  const handleSignUpSuccess = () => {
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return <SignUp onSuccess={handleSignUpSuccess} />;
};

export default page;
