import React from "react";
import { Container, VehicleStatus as VehicleStatusComponent } from "../components/index";

function VehicleStatus() {
    return (
        <Container className="my-20 min-h-screen">
            <VehicleStatusComponent />
        </Container>
    );
}

export default VehicleStatus;
