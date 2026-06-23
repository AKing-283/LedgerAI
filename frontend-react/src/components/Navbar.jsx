import { FiBell, FiUser, FiTrash2 } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  decodeToken,
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from "../services/api";

function Navbar({ collapsed }) {

  const navigate = useNavigate();
  const [email, setEmail] = useState("User");
  const [organization, setOrganization] = useState("Organization");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const decoded = decodeToken();

    if (decoded) {
      if (decoded.email) {
        setEmail(decoded.email);
      }

      if (decoded.organization_name) {
        setOrganization(decoded.organization_name);
      }
    }

    fetchNotifications();

    // ✅ Poll every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    // ✅ Listen for manual notification updates
    window.addEventListener("notification-update", fetchNotifications);

    const handleClickOutside = (e) => {
      if (dropdownRef.current &&
          !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notification-update", fetchNotifications);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    const list = await getNotifications();
    const count = await getUnreadCount();
    setNotificationList(list);
    setUnreadCount(count);
  };

  const handleRead = async (id) => {
    await markNotificationRead(id);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    fetchNotifications();
  };

  return (
    <div
      style={{
        height: "70px",
        borderRadius: "20px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600
          }}
        >
          {organization}
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}
      >
        <div
          onClick={() => navigate("/about")}
          style={{
            cursor: "pointer",
            fontSize: "14px",
            opacity: 0.8,
            padding: "6px 12px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          About
        </div>
        <div
          ref={dropdownRef}
          style={{ position: "relative" }}
        >
          <div
            onClick={() => setOpen(!open)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  color: "#000",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  animation: "pulse 1.5s infinite"
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "35px",
                width: "350px",
                maxHeight: "400px",
                overflowY: "auto",
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                backdropFilter: "blur(20px)",
                padding: "12px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                zIndex: 1000
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontWeight: 600
              }}>
                Notifications
                <span
                  onClick={handleReadAll}
                  style={{
                    fontSize: "12px",
                    cursor: "pointer",
                    opacity: 0.7
                  }}
                >
                  Mark all read
                </span>
              </div>

              {notificationList.length === 0 && (
                <div style={{ opacity: 0.6 }}>
                  No notifications yet
                </div>
              )}

              {notificationList.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    background: n.is_read
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer"
                  }}
                >
                  <div
                    onClick={() => handleRead(n.id)}
                    style={{ fontWeight: 600 }}
                  >
                    {n.title}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    opacity: 0.7
                  }}>
                    {n.message}
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "6px"
                  }}>
                    <FiTrash2
                      size={14}
                      style={{ cursor: "pointer", opacity: 0.6 }}
                      onClick={() => handleDelete(n.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          onClick={() => navigate("/profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.05)",
            padding: "8px 14px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer"
          }}
        >
          <FiUser />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.2
            }}
          >
            <span
              style={{
                fontSize: "13px",
                opacity: 0.7
              }}
            >
              {email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;