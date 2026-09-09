import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function PrivateLayout() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 overflow-y-auto container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
