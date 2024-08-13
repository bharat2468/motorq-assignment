import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminDashboard() {
	return (
		<div className="drawer lg:drawer-open">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				{/* Page content here */}
				<label
					htmlFor="my-drawer-2"
					className="btn btn-primary drawer-button lg:hidden">
					Open drawer
				</label>
				<div className="p-4">
					<Outlet />
				</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer-2" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
					{/* Sidebar content here */}
					<>
						<li>
							<Link to="/admin">Dashboard</Link>
						</li>
						<li>
							<Link to="/admin/users">Users</Link>
						</li>
						<li>
							<Link to="/admin/drivers">Drivers</Link>
						</li>
					</>
				</ul>
			</div>
		</div>
	);
}

export default AdminDashboard;
