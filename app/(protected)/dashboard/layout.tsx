import { NavigationBar } from "@/components/dashboard/NavigationBar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col bg-slate-100">
      <NavigationBar />
      {children}
    </div>
  );
}

export default DashboardLayout;