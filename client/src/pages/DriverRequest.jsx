import React from 'react';
import {DriverRequest as DriverRequestsComponent} from "../components/index.js";

function DriverRequest() {
	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Driver Requests</h1>
			<DriverRequestsComponent />
		</div>
	);
}

export default DriverRequest;
