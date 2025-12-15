// // import { useState, useEffect } from "react";
// // import Api from "../../Api/Api";

// // export default function Logs() {
// //   const [logs, setLogs] = useState([]);
// //   const token = sessionStorage.getItem("authToken");

// //   async function fetchLogs() {
// //     try {
// //       const res = await fetch(`${Api}/api/v1/logs`, {
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (!res.ok) {
// //         throw new Error(`Failed to fetch logs: ${res.status}`);
// //       }

// //       const data = await res.json();
// //       console.log("✅ Logs fetched:-------", data);
// //       setLogs(data);
// //     } catch (err) {
// //       console.error("❌ Error fetching logs:", err);
// //     }
// //   }

// //   useEffect(() => {
// //     fetchLogs();
// //   }, []);

// //   return (
// //     <div className="p-4">
// //         <section className="bg-white shadow-md rounded-2xl p-6">
// //             <h2 className="text-2xl font-bold mb-4">User Logs</h2>
// //             <div className="overflow-x-auto bg-white shadow-md rounded-2xl p-6 ">
// //                 <table className="min-w-full table-auto border border-gray-300 ">
// //                 <thead className="bg-gray-100">
// //                     <tr>
// //                     <th className="border px-4 py-2 text-left">User Name</th>
// //                     <th className="border px-4 py-2 text-left">Email</th>
// //                     <th className="border px-4 py-2 text-left">Event Type</th>
// //                     <th className="border px-4 py-2 text-left">Details</th>
// //                     <th className="border px-4 py-2 text-left">Date</th>
// //                     </tr>
// //                 </thead>

// //                 <tbody>
// //                     {logs.map((log) => (
// //                     <tr key={log.id} className="hover:bg-gray-50">
// //                         <td className="border px-4 py-2">{log.user?.name || "—"}</td>
// //                         <td className="border px-4 py-2">{log.user?.email || "—"}</td>
// //                         <td className="border px-4 py-2 font-semibold">{log.event_type}</td>
// //                         <td className="border px-4 py-2">{log.details}</td>
// //                         <td className="border px-4 py-2">
// //                         {new Date(log.created_at).toLocaleString()}
// //                         </td>
// //                     </tr>
// //                     ))}
// //                 </tbody>
// //                 </table>
// //             </div>
// //       </section>
// //     </div>
// //   );
// // }
// import { useState, useEffect, useMemo } from "react";
// import Api from "../../Api/Api";

// const TABS = [
//   { label: "All", value: "ALL" },
//   { label: "Screen", value: "SCREEN" },
//   { label: "Content", value: "CONTENT" },
//   { label: "User", value: "USER" },
// ];

// export default function Logs() {
//   const [logs, setLogs] = useState([]);
//   const [search, setSearch] = useState("");
//   const [eventFilter, setEventFilter] = useState("");
//   const [activeTab, setActiveTab] = useState("ALL");

//   const token = sessionStorage.getItem("authToken");

//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 10;




//   async function fetchLogs() {
//     try {
//       const res = await fetch(`${Api}/api/v1/logs`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       setLogs(data);
//     } catch (err) {
//       console.error("Error fetching logs:", err);
//     }
//   }

//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, eventFilter, activeTab]);


//   /* ---------- FILTER LOGIC ---------- */
//   const filteredLogs = useMemo(() => {
//     return logs.filter((log) => {
//       const text =
//         `${log.user?.name} ${log.user?.email} ${log.details}`.toLowerCase();

//       const matchesSearch = text.includes(search.toLowerCase());
//       const matchesEvent =
//         !eventFilter || log.event_type === eventFilter;

//       const matchesTab =
//         activeTab === "ALL" ||
//         log.event_type.startsWith(activeTab);

//       return matchesSearch && matchesEvent && matchesTab;
//     });
//   }, [logs, search, eventFilter, activeTab]);

//   const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

//   const paginatedLogs = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     const end = start + ITEMS_PER_PAGE;
//     return filteredLogs.slice(start, end);
//   }, [filteredLogs, currentPage]);


//   const uniqueEvents = [...new Set(logs.map((l) => l.event_type))];

//   return (
//     <div className="p-6">
//       <section className="bg-white rounded-2xl shadow-md p-6">
//         <h2 className="text-2xl font-bold mb-6">User Activity Logs</h2>

//         {/* 🔍 SEARCH + FILTER */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="Search user, email or details..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <select
//             value={eventFilter}
//             onChange={(e) => setEventFilter(e.target.value)}
//             className="border rounded-lg px-4 py-2 focus:outline-none"
//           >
//             <option value="">All Events</option>
//             {uniqueEvents.map((event) => (
//               <option key={event} value={event}>
//                 {event}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 🗂️ TABS */}
//         <div className="flex gap-3 mb-6 border-b">
//           {TABS.map((tab) => (
//             <button
//               key={tab.value}
//               onClick={() => setActiveTab(tab.value)}
//               className={`px-4 py-2 font-semibold rounded-t-lg ${
//                 activeTab === tab.value
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-600 hover:text-blue-600"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* 📋 TABLE */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border rounded-lg">
//             <thead className="bg-gray-100 sticky top-0">
//               <tr>
//                 <th className="px-4 py-3 text-left">User</th>
//                 <th className="px-4 py-3 text-left">Email</th>
//                 <th className="px-4 py-3 text-left">Event</th>
//                 <th className="px-4 py-3 text-left">Details</th>
//                 <th className="px-4 py-3 text-left">Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredLogs.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="text-center py-6 text-gray-500"
//                   >
//                     No logs found
//                   </td>
//                 </tr>
//               )}

//               {/* {filteredLogs.map((log) => (
//                 <tr
//                   key={log.id}
//                   className="border-t hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-2">
//                     {log.user?.name || "—"}
//                   </td>
//                   <td className="px-4 py-2">
//                     {log.user?.email || "—"}
//                   </td>
//                   <td className="px-4 py-2 font-semibold text-blue-700">
//                     {log.event_type}
//                   </td>
//                   <td className="px-4 py-2">
//                     {log.details}
//                   </td>
//                   <td className="px-4 py-2 text-sm text-gray-600">
//                     {new Date(log.created_at).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </td>
//                 </tr>
//               ))} */}

//               {paginatedLogs.map((log) => (
//                 <tr key={log.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-2">{log.user?.name || "—"}</td>
//                   <td className="px-4 py-2">{log.user?.email || "—"}</td>
//                   <td className="px-4 py-2 font-semibold text-blue-700">
//                     {log.event_type}
//                   </td>
//                   <td className="px-4 py-2">{log.details}</td>
//                   <td className="px-4 py-2 text-sm text-gray-600">
//                     {new Date(log.created_at).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </td>
//                 </tr>
//               ))}

//             </tbody>
//           </table>
//           {/* 📄 PAGINATION */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-6">
//               <p className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                   className={`px-3 py-1 rounded-lg border ${
//                     currentPage === 1
//                       ? "text-gray-400 cursor-not-allowed"
//                       : "hover:bg-gray-100"
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   className={`px-3 py-1 rounded-lg border ${
//                     currentPage === totalPages
//                       ? "text-gray-400 cursor-not-allowed"
//                       : "hover:bg-gray-100"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}

//         </div>
//       </section>
//     </div>
//   );
// }
import { useState, useEffect, useMemo } from "react";
import Api from "../../Api/Api";

/* ---------------- LOG FILTER TABS ---------------- */
const LOG_TABS = [
  { label: "All", value: "ALL" },
  { label: "Screen", value: "SCREEN" },
  { label: "Content", value: "CONTENT" },
  { label: "User", value: "USER" },
];

/* ---------------- MAIN TABS ---------------- */
const MAIN_TABS = [
  { label: "Logs", value: "LOGS" },
  { label: "Management", value: "MANAGEMENT" },
];

export default function Logs() {
  const token = sessionStorage.getItem("authToken");

  /* ---------------- MAIN TAB ---------------- */
  const [mainTab, setMainTab] = useState("LOGS");

  /* ---------------- LOG STATES ---------------- */
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [activeLogTab, setActiveLogTab] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  /* ---------------- USER MANAGEMENT STATES ---------------- */
  const [users, setUsers] = useState([]);

  /* ---------------- FETCH LOGS ---------------- */
  async function fetchLogs() {
    try {
      const res = await fetch(`${Api}/api/v1/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setLogs(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------------- FETCH USERS ---------------- */
  async function fetchUsers() {
    try {
      const res = await fetch(`${Api}/api/v1/logs/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, eventFilter, activeLogTab]);

  /* ---------------- LOG FILTER ---------------- */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const text =
        `${log.user?.name} ${log.user?.email} ${log.details}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (!eventFilter || log.event_type === eventFilter) &&
        (activeLogTab === "ALL" ||
          log.event_type.startsWith(activeLogTab))
      );
    });
  }, [logs, search, eventFilter, activeLogTab]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const uniqueEvents = [...new Set(logs.map((l) => l.event_type))];

  /* ---------------- UPDATE ROLE ---------------- */
  const updateRole = async (userId, permission) => {
    console.log("Updating user:", userId, "to role:", permission);
    try {
      await fetch(`${Api}/api/v1/logs/${userId}/update_users_permission`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permission }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, permission } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <section className="bg-white rounded-2xl shadow-md p-6">

        {/* ================= MAIN TABS ================= */}
        <div className="flex gap-4 mb-6 border-b">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMainTab(tab.value)}
              className={`px-6 py-3 font-semibold ${
                mainTab === tab.value
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= LOGS TAB ================= */}
        {mainTab === "LOGS" && (
          <>
            <h2 className="text-3xl font-bold mb-6">User Activity Logs</h2>

            {/* SEARCH & FILTER */}
            <div className="flex flex-wrap gap-4 mb-6">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full md:w-1/3"
              />

              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="">All Events</option>
                {uniqueEvents.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>

            {/* LOG TYPE TABS */}
            <div className="flex gap-3 mb-4 border-b">
              {LOG_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveLogTab(tab.value)}
                  className={`px-4 py-2 font-semibold ${
                    activeLogTab === tab.value
                      ? "bg-blue-600 text-white rounded-t"
                      : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LOG TABLE */}
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-3">{log.user?.name}</td>
                    <td className="p-3">{log.user?.email}</td>
                    <td className="p-3 font-semibold text-blue-600">
                      {log.event_type}
                    </td>
                    <td className="p-3">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ================= MANAGEMENT TAB ================= */}
        {mainTab === "MANAGEMENT" && (
          <>
            <h2 className="text-3xl font-bold mb-6">User Management</h2>

            <table className="w-full table-fixed border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left w-1/4">Name</th>
                  <th className="p-3 text-left w-1/3">Email</th>
                  <th className="p-3 text-left w-1/6">Role</th>
                  <th className="p-3 text-left w-1/6">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3 text-left">{user.name}</td>
                    <td className="p-3 text-left">{user.email}</td>
                    <td className="p-3 text-left font-semibold">
                      {user.permission}
                    </td>
                    <td className="p-3 text-left">
                      <select
                        value={user.permission}
                        onChange={(e) =>
                          updateRole(user.id, e.target.value)
                        }
                        className="border rounded px-3 py-1"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>





          </>
        )}
      </section>
    </div>
  );
}
