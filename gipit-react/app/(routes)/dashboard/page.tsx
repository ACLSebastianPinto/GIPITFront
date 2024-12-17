import React from "react";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>Hola Carlos,</h1>
        <p>
          Simplifica tu gestión de contrataciones y toma decisiones más rápido.
        </p>

        <div className="summary-cards">
          <div className="card active-processes">
            <h2>02</h2>
            <p>Procesos Activos</p>
          </div>
          <div className="card closed-processes">
            <h2>12</h2>
            <p>Procesos Cerrados</p>
          </div>
          <div className="card active-professionals">
            <h2>23</h2>
            <p>Profesionales Activos</p>
          </div>
          <div className="card average-time">
            <h2>12 días</h2>
            <p>Tiempo promedio de contratación</p>
          </div>
        </div>

        <div className="billing-card">
          <h2>Facturación de Diciembre</h2>
          <p>$12.000</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;