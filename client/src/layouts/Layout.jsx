import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="md:ml-72 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;