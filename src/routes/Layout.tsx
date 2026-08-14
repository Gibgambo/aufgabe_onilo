import { NavLink, Outlet } from "react-router";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-lg font-semibold ${
    isActive ? "text-white border-b-2 border-onilo-accent" : "text-white hover:text-onilo-background-dark"
  }`;

export function Layout() {
  return (
    <>
      <header className="bg-onilo-primary flex gap-4 px-6 py-4 justify-center">
        <NavLink to="/editor" className={navLinkClassName}>
          Editor
        </NavLink>
        <NavLink to="/recordings" className={navLinkClassName}>
          Recordings-Dashboard
        </NavLink>
      </header>
      <Outlet />
    </>
  );
}
