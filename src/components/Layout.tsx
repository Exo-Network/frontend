import { ReactNode } from "react";
import { Link } from "react-router-dom";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header
        style={{
          height: 80,
          background: "#111",
          color: "white",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/exonet.svg"
            alt="ExoNet logo"
            style={{ height: 40, marginRight: 10 }}
          />
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>ExoNet</h1>
        </div>
        <nav>
          <Link to="/" style={{ marginRight: 15, color: "white" }}>
            Home
          </Link>
          <Link to="/cesium" style={{ color: "white" }}>
            Viewer
          </Link>
        </nav>
      </header>
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
};
