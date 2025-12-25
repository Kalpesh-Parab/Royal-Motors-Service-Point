import "./Sidebar.scss";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">Royal Admin</div>

      <nav>
        <button className="active">Services</button>
        <button disabled>Leads</button>
        <button disabled>Invoices</button>
      </nav>
    </aside>
  );
}
