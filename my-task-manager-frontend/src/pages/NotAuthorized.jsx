// src/pages/NotAuthorized.jsx
import React from "react";

export default function NotAuthorized() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p>You are not authorized to view this page. Please contact an administrator.</p>
    </div>
  );
}
