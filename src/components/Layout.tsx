import { Flex } from "@chakra-ui/react";
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
                  <Link to="/" style={{ marginRight: 15, color: "white" }}>

        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/exonet.svg"
            alt="ExoNet logo"
            style={{ height: 40, marginRight: 10 }}
          />
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>DecentSpace</h1>
          
        </div>
        </Link>
       
        <Flex gap={4}>
          <Link to="/dashboard" style={{ marginRight: 15, color: "white" }}>
            My Assets
          </Link>
          <Link to="/cesium" style={{ color: "white" }}>
            Viewer
          </Link>
        </Flex>
        {/* </nav> */}
      </header>
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
};
