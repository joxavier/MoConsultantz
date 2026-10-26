'use client';

import React, { useEffect, useState } from "react";
import Header from '../components/Header';
import PieComponent from "./pie";
import AssetsTable from "./assetsTable";

export default function Vestmentz() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}
    >
      {/* Render header component */}
      <Header />

      <div style={{ maxWidth: '1320px' }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            margin: "0 auto",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "20px" }}>Fund Dashboard</h1>
          <PieComponent />
          <AssetsTable  />
        </div>
      </div>
    </main>
  );
}
