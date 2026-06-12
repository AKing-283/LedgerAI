import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0F172A"
      }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          transition: "all 0.3s ease"
        }}
      >
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div
          style={{
            flex: 1,
            marginTop: "20px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;