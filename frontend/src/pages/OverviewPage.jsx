import React from "react";
import { useAuthStore } from "../stores/useAuthStore.js";

const OverviewPage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Overview</h1>
    </div>
  );
};

export default OverviewPage;
