// import React, { useState, useEffect } from "react";
// import Api from "../../Api/Api";

// function Contents() {
//    const [screens, setScreens] = useState([]);
//   const [contents, setContents] = useState([]);
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [contant, setContant] = useState("");
//   const [contentType, setContentType] = useState("image");
//   const token = sessionStorage.getItem("authToken");
//   const role = sessionStorage.getItem("role");
//   const [screenName, setScreenName] = useState("");
//   const [assignments, setAssignments] = useState({}); // {screenId: [contents]}


//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedScreen, setSelectedScreen] = useState(null);
//   const [backgroundFile, setBackgroundFile] = useState(null);


//   const [containers, setContainers] = useState([]);
//   const [containerName, setContainerName] = useState("");




//   useEffect(() => {
//     fetchScreens();
//     fetchContents();
//     fetchAssignments();
//     fetchContainers();
//   }, []);

//     async function fetchScreens() {
//         try {
//             const res = await fetch(`${Api}/api/v1/screens`, {
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             });

//             if (!res.ok) throw new Error(`Failed to fetch screens: ${res.status}`);
//             const data = await res.json();
//             setScreens(data);
//         } catch (err) {
//             console.error("❌ Error fetching screens:", err);
//         }
//     }

//     // Fetch assignments
//     async function fetchAssignments() {
//     try {
//         const res = await fetch(`${Api}/api/v1/assignments`, {
//         headers: { "Authorization": `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`);
//         const data = await res.json();
//         console.log(data)
//         // Convert to {screenId: [contents]} with content_id included
//         const map = {};

//         data.forEach(a => {
//         if (!map[a.screen_id]) map[a.screen_id] = [];

//         // Push an object that includes content info + content_id
//         map[a.screen_id].push({
//             ...a.content,       // all content fields
//             content_id: a.content_id, // add content_id
//             screen_id: a.screen_id,
//             assignment_id: a.id // optional: assignment id if you want
//         });
//         });

//         console.log(map);
//         setAssignments(map);
//     } catch (err) {
//         console.error(err);
//     }
//     }

//     async function unassign(contentId, screenId) {
//         console.log("Trying to unassign:", contentId, screenId);

//         try {
//             console.log('assignments:', assignments);
//             console.log('assignments type:', typeof assignments);

//             // Get assignments array for the screen, fallback to empty array
//             const screenAssignments = assignments[screenId] || [];

//             // Flatten nested structure if needed
//             const flattenedAssignments = screenAssignments.flatMap(a => 
//                 Array.isArray(a) ? a : [a]
//             );

//             console.log("Flattened assignments for screen:", flattenedAssignments);

//             // Find assignment by content_id
//             const assignment = flattenedAssignments.find(a => a.content_id === contentId && a.screen_id == screenId);

//             console.log("Found assignment:", assignment);
//             if (!assignment) return;

//             const res = await fetch(`${Api}/api/v1/assignments/${assignment.assignment_id}`, {
//                 method: "DELETE",
//                 headers: { "Authorization": `Bearer ${token}` },
//             });

//             if (!res.ok) throw new Error("Failed to unassign");

//             alert("✅ Unassigned!");
//             fetchAssignments(); // refresh assignments state
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     // create screen
//     async function createScreen(e) {
//         e.preventDefault();
//         try {
//             const res = await fetch(`${Api}/api/v1/screens`, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ name: screenName }),
//             });

//             if (!res.ok) throw new Error(`Screen creation failed: ${res.status}`);
//             setScreenName("");
//             fetchScreens(); // refresh list
//             alert("✅ Screen created successfully!");
//         } catch (err) {
//             console.error("❌ Error creating screen:", err);
//         }
//     }

//     async function fetchContents() {
//         try {
//             const res = await fetch(`${Api}/api/v1/contents`, {
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             });

//             if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
//             const data = await res.json();
//             setContents(data);
//         } catch (err) {
//             console.error("❌ Error fetching contents:", err);
//         }
//         }

//     async function upload(e) {
//         e.preventDefault();

//         try {
//             const form = new FormData();
//             form.append("title", title);
//             form.append("content", contant);
//             form.append("content_type", contentType);

//             if (file) for (const f of file) form.append("files[]", f);

//             const res = await fetch(`${Api}/api/v1/contents`, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//             },
//             body: form,
//             });

//             if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
//             await fetchContents(); // refresh after upload
//         } catch (err) {
//             console.error("❌ Error uploading content:", err);
//         }
//     }

//     async function assign(screenId, contentId) {
//         console.log("--------------------------asssign----------------")
//         try {
//             const res = await fetch(`${Api}/api/v1/assignments`, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 screen_id: screenId,
//                 content_id: contentId,
//             }),
//             });

//             if (!res.ok) throw new Error(`Assignment failed: ${res.status}`);
//             alert("✅ Assigned!");
//             fetchAssignments();
//             fetchContents();
//         } catch (err) {
//             console.error("❌ Error assigning content:", err);
//         }
//     }
//     async function deleteScreen(screenId) {
//         if(!window.confirm("Are you sure to delete screen?")) return;
//         await fetch(`${Api}/api/v1/screens/${screenId}`, { method: "DELETE", headers: {"Authorization": `Bearer ${token}`} });
//         fetchScreens();
//     }

//     async function deleteContent(contentId) {
//         if(!window.confirm("Are you sure to delete content?")) return;
//         await fetch(`${Api}/api/v1/contents/${contentId}`, { method: "DELETE", headers: {"Authorization": `Bearer ${token}`} });
//         fetchContents();
//         fetchAssignments();
//     }

//     async function deleteScreen(screenId) {
//         if(!window.confirm("Are you sure to delete screen?")) return;
//         await fetch(`${Api}/api/v1/screens/${screenId}`, { 
//             method: "DELETE", 
//             headers: {"Authorization": `Bearer ${token}`} 
//         });
//         fetchScreens();
//     }


//     async function uploadBackground(e) {
//         e.preventDefault();
//         if (!backgroundFile) return alert("Please select a file");

//         const formData = new FormData();
//         formData.append("background", backgroundFile);

//         const res = await fetch(`${Api}/api/v1/screens/${selectedScreen.id}/upload_background`, {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//         });

//         if (!res.ok) {
//         alert("❌ Upload failed");
//         return;
//         }

//         alert("✅ Background uploaded successfully!");
//         setShowPopup(false);
//         setBackgroundFile(null);
//         fetchScreens(); // Refresh list
//     }


//     async function fetchContainers() {
//     const res = await fetch(`${Api}/api/v1/screen_containers`, {
//         headers: { "Authorization": `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setContainers(data);
//     }

//     async function createContainer(e) {
//     e.preventDefault();
//     await fetch(`${Api}/api/v1/screen_containers`, {
//         method: "POST",
//         headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: containerName }),
//     });
//     setContainerName("");
//     fetchContainers();
//     }

//     async function assignScreenToContainer(containerId, screenId) {
//     await fetch(`${Api}/api/v1/screen_containers/${containerId}/assign_screen`, {
//         method: "POST",
//         headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ screen_id: screenId }),
//     });
//     fetchContainers();
//     }

//     async function unassignScreenFromContainer(containerId, screenId) {
//     await fetch(`${Api}/api/v1/screen_containers/${containerId}/unassign_screen?screen_id=${screenId}`, {
//         method: "DELETE",
//         headers: { "Authorization": `Bearer ${token}` },
//     });
//     fetchContainers();
//     }



//   return (
//     <div className="p-6">
//       {/* <h2 className="text-xl font-semibold mb-4">Container Screens Viewer</h2> */}

//         <section className="bg-white shadow-md rounded-2xl p-6">
//             <h3 className="text-2xl font-semibold mb-4 text-gray-700">Contents</h3>
//             {contents.length === 0 ? (
//                 <p className="text-gray-500">No contents uploaded yet.</p>
//             ) : (
//                 // <ul className="space-y-6">
//                 // {contents.map((c) => (
//                 //     <li
//                 //     key={`content-${c.id}`}
//                 //     className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
//                 //     >
//                 //     <div className="flex justify-between items-center mb-2">
//                 //         <h4 className="text-lg font-semibold">{c.title}</h4>
//                 //         <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
//                 //         {c.content_type}
//                 //         </span>
//                 //     </div>

//                 //     <div className="mt-3">
//                 //         <span className="block text-gray-600 mb-2 font-medium">Assign to:</span>
//                 //         <div className="flex flex-wrap gap-3">
//                 //         {screens.map((s) => {
//                 //             // Find assigned content for this screen & this content only
//                 //             const isAssigned = assignments[s.id]?.some(
//                 //             (assigned) => assigned.id === c.id
//                 //             );

//                 //             return (
//                 //             <div key={`screen-${s.id}-content-${c.id}`} className="flex items-center gap-2">
//                 //                 {/* Assign / Unassign button */}
//                 //                 <button
//                 //                 onClick={() =>
//                 //                     isAssigned ? unassign(c.id, s.id) : assign(s.id, c.id)
//                 //                 }
//                 //                 className={`px-4 py-1 rounded-lg transition duration-200 ${
//                 //                     isAssigned
//                 //                     ? "bg-red-500 text-white hover:bg-red-600"
//                 //                     : "bg-blue-500 text-white hover:bg-blue-600"
//                 //                 }`}
//                 //                 >
//                 //                 {s.name}
//                 //                 </button>

//                 //                 {/* Show assigned label */}
//                 //                 {isAssigned && (
//                 //                 <span className="ml-2 px-2 py-1 bg-blue-100 rounded flex items-center gap-1">
//                 //                     Assigned
//                 //                 </span>
//                 //                 )}
//                 //             </div>
//                 //             );
//                 //         })}
//                 //         </div>
//                 //     </div>
//                 //     </li>
//                 // ))}
//                 // </ul>
//                 <ul className="space-y-6">
//                 {contents.map((c) => (
//                     <li
//                     key={`content-${c.id}`}
//                     className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
//                     >
//                     <div className="flex justify-between items-center mb-2">
//                         <div>
//                         <h4 className="text-lg font-semibold">{c.title}</h4>
//                         <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
//                             {c.content_type}
//                         </span>
//                         </div>

//                         {/* 🗑️ DELETE BUTTON */}
//                         <button
//                         onClick={() => deleteContent(c.id)}
//                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-200"
//                         >
//                         Delete
//                         </button>
//                     </div>

//                     <div className="mt-3">
//                         <span className="block text-gray-600 mb-2 font-medium">Assign to:</span>
//                         <div className="flex flex-wrap gap-3">
//                         {screens.map((s) => {
//                             const isAssigned = assignments[s.id]?.some(
//                             (assigned) => assigned.id === c.id
//                             );

//                             return (
//                             <div
//                                 key={`screen-${s.id}-content-${c.id}`}
//                                 className="flex items-center gap-2"
//                             >
//                                 <button
//                                 onClick={() =>
//                                     isAssigned ? unassign(c.id, s.id) : assign(s.id, c.id)
//                                 }
//                                 className={`px-4 py-1 rounded-lg transition duration-200 ${
//                                     isAssigned
//                                     ? "bg-red-500 text-white hover:bg-red-600"
//                                     : "bg-blue-500 text-white hover:bg-blue-600"
//                                 }`}
//                                 >
//                                 {s.name}
//                                 </button>

//                                 {isAssigned && (
//                                 <span className="ml-2 px-2 py-1 bg-blue-100 rounded flex items-center gap-1">
//                                     Assigned
//                                 </span>
//                                 )}
//                             </div>
//                             );
//                         })}
//                         </div>
//                     </div>
//                     </li>
//                 ))}
//                 </ul>

//             )}
//         </section>
//     </div>
//   );
// }

// export default Contents;
import React, { useState, useEffect } from "react";
import Api from "../../Api/Api";

function Contents() {
  const [screens, setScreens] = useState([]);
  const [contents, setContents] = useState([]);
  const [assignments, setAssignments] = useState({});
  const token = sessionStorage.getItem("authToken");

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPosition, setEditPosition] = useState("Center");
  const [editHyperlink, setEditHyperlink] = useState("");
  const [editTransition, setEditTransition] = useState("fade");
  const [logo, setLogo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
    // Pagination Logic
  const totalPages = Math.ceil(contents.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentContents = contents.slice(indexOfFirst, indexOfLast);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };




  useEffect(() => {
    fetchScreens();
    fetchContents();
    fetchAssignments();
  }, []);

  async function fetchScreens() {
    try {
      const res = await fetch(`${Api}/api/v1/screens`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setScreens(data);
    } catch (err) {
      console.error("❌ Error fetching screens:", err);
    }
  }

  async function fetchAssignments() {
    try {
      const res = await fetch(`${Api}/api/v1/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const map = {};
      data.forEach((a) => {
        if (!map[a.screen_id]) map[a.screen_id] = [];
        map[a.screen_id].push({
          ...a.content,
          content_id: a.content_id,
          screen_id: a.screen_id,
          assignment_id: a.id,
        });
      });
      setAssignments(map);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchContents() {
    try {
      const res = await fetch(`${Api}/api/v1/contents`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Fetched contents:================", data);
      setContents(data);
    } catch (err) {
      console.error("❌ Error fetching contents:", err);
    }
  }

  async function assign(screenId, contentId) {
    try {
      const res = await fetch(`${Api}/api/v1/assignments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ screen_id: screenId, content_id: contentId }),
      });
      if (!res.ok) throw new Error("Assignment failed");
      alert("✅ Assigned!");
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  }

  async function unassign(contentId, screenId) {
    try {
      const screenAssignments = assignments[screenId] || [];
      const assignment = screenAssignments.find(
        (a) => a.content_id === contentId && a.screen_id === screenId
      );
      if (!assignment) return;

      const res = await fetch(`${Api}/api/v1/assignments/${assignment.assignment_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to unassign");
      alert("✅ Unassigned!");
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteContent(contentId) {
    if (!window.confirm("Are you sure to delete content?")) return;
    await fetch(`${Api}/api/v1/contents/${contentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchContents();
    fetchAssignments();
  }

  function openEditPopup(content) {
    setSelectedContent(content);
    setEditTitle(content.title);
    setEditContent(content.content);
    setEditPosition(content.position || "Center");
    setEditHyperlink(content.hyperlink || "");
    setEditTransition(content.transition_effect || "fade");
    setShowEditPopup(true);
  }

  async function updateContent(e) {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", editTitle);
      form.append("content", editContent);
      form.append("position", editPosition);
      form.append("hyperlink", editHyperlink);
      form.append("transition_effect", editTransition);

      if (logo && logo.length > 0) {
        Array.from(logo).forEach((lg) => form.append("logo", lg));
      }

      const res = await fetch(`${Api}/api/v1/contents/${selectedContent.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update content");
      alert("✅ Content updated successfully!");
      setShowEditPopup(false);
      fetchContents();
    } catch (err) {
      console.error("❌ Error updating content:", err);
      alert("❌ Update failed.");
    }
  }

  return (
    <div className="p-6">
      <section className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Contents</h3>
        {contents.length === 0 ? (
          <p className="text-gray-500">No contents uploaded yet.</p>
        ) : (
          <ul className="space-y-6">
            {currentContents.map((c) => (
              <li
                key={`content-${c.id}`}
                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="text-lg font-semibold">{c.title}</h4>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
                      {c.content_type}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditPopup(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteContent(c.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="block text-gray-600 mb-2 font-medium">
                    Assign to:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {screens.map((s) => {
                      const isAssigned = assignments[s.id]?.some(
                        (assigned) => assigned.id === c.id
                      );

                      return (
                        <div
                          key={`screen-${s.id}-content-${c.id}`}
                          className="flex items-center gap-2"
                        >
                          <button
                            onClick={() =>
                              isAssigned ? unassign(c.id, s.id) : assign(s.id, c.id)
                            }
                            className={`px-4 py-1 rounded-lg transition duration-200 ${
                              isAssigned
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            {s.name}
                          </button>

                          {isAssigned && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 rounded flex items-center gap-1">
                              Assigned
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Pagination */}
        {contents.length > 4 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            <span className="font-semibold">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        )}

      </section>

      {/* 🟡 Edit Popup Modal */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-lg relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Edit Content
            </h3>

            <button
              onClick={() => setShowEditPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <form onSubmit={updateContent} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 h-24"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Position</label>
                <select
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Top-Left">Top-Left</option>
                  <option value="Top-Right">Top-Right</option>
                  <option value="Bottom-Left">Bottom-Left</option>
                  <option value="Bottom-Right">Bottom-Right</option>
                  <option value="Center">Center</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Hyperlink</label>
                <input
                  type="url"
                  value={editHyperlink}
                  onChange={(e) => setEditHyperlink(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Upload Logo
                </label>
                
                <input
                  type="file"
                  onChange={(e) => setLogo(e.target.files)}
                  className="w-full border border-dashed px-4 py-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Transition Effect</label>
                <select
                  value={editTransition}
                  onChange={(e) => setEditTransition(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="fade">Fade</option>
                  <option value="zoom">Zoom</option>
                  <option value="slide-left">Slide Left</option>
                  <option value="slide-right">Slide Right</option>
                  <option value="slide-up">Slide Up</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contents;
