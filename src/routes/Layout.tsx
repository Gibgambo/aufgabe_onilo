import { NavLink, Outlet } from "react-router";

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-lg font-semibold ${
    isActive ? "text-white border-b-2 border-onilo-accent" : "text-white hover:text-onilo-nav-hover"
  }`;

export function Layout() {
  return (
    <>
      <header className="bg-onilo-primary font-display flex gap-4 px-6 py-4 justify-center">
        <NavLink to="/editor" className={getNavLinkClassName}>
          Editor
        </NavLink>
        <NavLink to="/recordings" className={getNavLinkClassName}>
          Recordings-Dashboard
        </NavLink>
      </header>
      <Outlet />
    </>
  );
}
