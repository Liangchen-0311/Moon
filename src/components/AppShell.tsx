import React from "react";
import BottomNav from "./BottomNav";

interface ShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const AppShell: React.FC<ShellProps> = ({ children, showNav }) => (
  <div className="lunar-container">
    <div className="lunar-phone">
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      {showNav && <BottomNav />}
    </div>
  </div>
);

export default AppShell;
