'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  School,
  BookOpenCheck,
  Puzzle,
  Monitor,
  Trophy,
  PieChart,
  Gauge,
  Mail,
  LogOut,
} from "lucide-react";

import "../styles/withSidebar.scss";

const modules = [
  { name: "Dashboard", path: "/", icon: <Gauge size={24} /> },

  { name: "Training", path: "/training", icon: <School size={24} /> },
  { name: "Lessons", path: "/lessons", icon: <BookOpenCheck size={24} /> },
  { name: "Practice", path: "/practice", icon: <Puzzle size={24} /> },
  { name: "Online", path: "/online-learning", icon: <Monitor size={24} /> },
  { name: "Tournaments", path: "/tournaments", icon: <Trophy size={24} /> },
  { name: "Performance", path: "/performance", icon: <PieChart size={24} /> },
  {
    name: "Support",
    path: "/support",
    icon: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        {/* <Phone size={16} /> */}
        <Mail size={24} />
      </div>
    )
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    router.push("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-links">
          {modules.map((mod, i) => {
            const isActive = pathname === mod.path;
            return (
              <Link
                key={i}
                href={mod.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                {mod.icon}
                <span>{mod.name}</span>
              </Link>
            );
          })}
        </div>

        {/* 🔘 Logout at Bottom */}
        <div className="sidebar-logout">
          <a href="#" onClick={handleLogoutClick} className="sidebar-link">
            <LogOut size={24} />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 🔔 Logout Confirmation */}
      {showLogoutPopup && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            textAlign: 'center',
            minWidth: '300px'
          }}>
            <h2 style={{ color: 'black' }}>Are you sure you want to logout?</h2>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={handleCancelLogout}
                style={{
                  padding: '0.5rem 1.2rem',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#000000',
                  color: '#fff',
                }}>
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                style={{
                  padding: '0.5rem 1.2rem',
                  cursor: 'pointer',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px'
                }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
