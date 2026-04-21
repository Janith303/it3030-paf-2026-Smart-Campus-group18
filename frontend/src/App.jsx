import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Sidebar, Topbar } from "./components/Admin/navbar";
import Dash from "./components/Admin/dash";
import Incidents from "./components/Admin/incidents";
import CreateIncident from "./components/Admin/createIncident";
import TicketDetails from "./components/Admin/ticketDetails";

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dash />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="incidents/create" element={<CreateIncident />} />
          <Route path="incidents/:id" element={<TicketDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;