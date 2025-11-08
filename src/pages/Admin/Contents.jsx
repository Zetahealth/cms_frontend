import React, { useState, useEffect } from "react";
import Api from "../../Api/Api";

function Contents() {
   const [screens, setScreens] = useState([]);
  const [contents, setContents] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [contant, setContant] = useState("");
  const [contentType, setContentType] = useState("image");
  const token = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");
  const [screenName, setScreenName] = useState("");
  const [assignments, setAssignments] = useState({}); // {screenId: [contents]}


  const [showPopup, setShowPopup] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);


  const [containers, setContainers] = useState([]);
  const [containerName, setContainerName] = useState("");




  useEffect(() => {
    fetchScreens();
    fetchContents();
    fetchAssignments();
    fetchContainers();
  }, []);

    async function fetchScreens() {
        try {
            const res = await fetch(`${Api}/api/v1/screens`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });

            if (!res.ok) throw new Error(`Failed to fetch screens: ${res.status}`);
            const data = await res.json();
            setScreens(data);
        } catch (err) {
            console.error("❌ Error fetching screens:", err);
        }
    }

    // Fetch assignments
    async function fetchAssignments() {
    try {
        const res = await fetch(`${Api}/api/v1/assignments`, {
        headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`);
        const data = await res.json();
        console.log(data)
        // Convert to {screenId: [contents]} with content_id included
        const map = {};

        data.forEach(a => {
        if (!map[a.screen_id]) map[a.screen_id] = [];

        // Push an object that includes content info + content_id
        map[a.screen_id].push({
            ...a.content,       // all content fields
            content_id: a.content_id, // add content_id
            screen_id: a.screen_id,
            assignment_id: a.id // optional: assignment id if you want
        });
        });

        console.log(map);
        setAssignments(map);
    } catch (err) {
        console.error(err);
    }
    }

    async function unassign(contentId, screenId) {
        console.log("Trying to unassign:", contentId, screenId);

        try {
            console.log('assignments:', assignments);
            console.log('assignments type:', typeof assignments);

            // Get assignments array for the screen, fallback to empty array
            const screenAssignments = assignments[screenId] || [];

            // Flatten nested structure if needed
            const flattenedAssignments = screenAssignments.flatMap(a => 
                Array.isArray(a) ? a : [a]
            );

            console.log("Flattened assignments for screen:", flattenedAssignments);

            // Find assignment by content_id
            const assignment = flattenedAssignments.find(a => a.content_id === contentId && a.screen_id == screenId);

            console.log("Found assignment:", assignment);
            if (!assignment) return;

            const res = await fetch(`${Api}/api/v1/assignments/${assignment.assignment_id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to unassign");

            alert("✅ Unassigned!");
            fetchAssignments(); // refresh assignments state
        } catch (err) {
            console.error(err);
        }
    }

    // create screen
    async function createScreen(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${Api}/api/v1/screens`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: screenName }),
            });

            if (!res.ok) throw new Error(`Screen creation failed: ${res.status}`);
            setScreenName("");
            fetchScreens(); // refresh list
            alert("✅ Screen created successfully!");
        } catch (err) {
            console.error("❌ Error creating screen:", err);
        }
    }

    async function fetchContents() {
        try {
            const res = await fetch(`${Api}/api/v1/contents`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });

            if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
            const data = await res.json();
            setContents(data);
        } catch (err) {
            console.error("❌ Error fetching contents:", err);
        }
        }

    async function upload(e) {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append("title", title);
            form.append("content", contant);
            form.append("content_type", contentType);

            if (file) for (const f of file) form.append("files[]", f);

            const res = await fetch(`${Api}/api/v1/contents`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: form,
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            await fetchContents(); // refresh after upload
        } catch (err) {
            console.error("❌ Error uploading content:", err);
        }
    }

    async function assign(screenId, contentId) {
        console.log("--------------------------asssign----------------")
        try {
            const res = await fetch(`${Api}/api/v1/assignments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                screen_id: screenId,
                content_id: contentId,
            }),
            });

            if (!res.ok) throw new Error(`Assignment failed: ${res.status}`);
            alert("✅ Assigned!");
            fetchAssignments();
            fetchContents();
        } catch (err) {
            console.error("❌ Error assigning content:", err);
        }
    }
    async function deleteScreen(screenId) {
        if(!window.confirm("Are you sure to delete screen?")) return;
        await fetch(`${Api}/api/v1/screens/${screenId}`, { method: "DELETE", headers: {"Authorization": `Bearer ${token}`} });
        fetchScreens();
    }

    async function deleteContent(contentId) {
        if(!window.confirm("Are you sure to delete content?")) return;
        await fetch(`${Api}/api/v1/contents/${contentId}`, { method: "DELETE", headers: {"Authorization": `Bearer ${token}`} });
        fetchContents();
        fetchAssignments();
    }

    async function deleteScreen(screenId) {
        if(!window.confirm("Are you sure to delete screen?")) return;
        await fetch(`${Api}/api/v1/screens/${screenId}`, { 
            method: "DELETE", 
            headers: {"Authorization": `Bearer ${token}`} 
        });
        fetchScreens();
    }


    async function uploadBackground(e) {
        e.preventDefault();
        if (!backgroundFile) return alert("Please select a file");

        const formData = new FormData();
        formData.append("background", backgroundFile);

        const res = await fetch(`${Api}/api/v1/screens/${selectedScreen.id}/upload_background`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
        });

        if (!res.ok) {
        alert("❌ Upload failed");
        return;
        }

        alert("✅ Background uploaded successfully!");
        setShowPopup(false);
        setBackgroundFile(null);
        fetchScreens(); // Refresh list
    }


    async function fetchContainers() {
    const res = await fetch(`${Api}/api/v1/screen_containers`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    setContainers(data);
    }

    async function createContainer(e) {
    e.preventDefault();
    await fetch(`${Api}/api/v1/screen_containers`, {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: containerName }),
    });
    setContainerName("");
    fetchContainers();
    }

    async function assignScreenToContainer(containerId, screenId) {
    await fetch(`${Api}/api/v1/screen_containers/${containerId}/assign_screen`, {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ screen_id: screenId }),
    });
    fetchContainers();
    }

    async function unassignScreenFromContainer(containerId, screenId) {
    await fetch(`${Api}/api/v1/screen_containers/${containerId}/unassign_screen?screen_id=${screenId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
    });
    fetchContainers();
    }



  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Container Screens Viewer</h2>

        <section className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Contents</h3>
            {contents.length === 0 ? (
                <p className="text-gray-500">No contents uploaded yet.</p>
            ) : (
                // <ul className="space-y-6">
                // {contents.map((c) => (
                //     <li
                //     key={`content-${c.id}`}
                //     className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                //     >
                //     <div className="flex justify-between items-center mb-2">
                //         <h4 className="text-lg font-semibold">{c.title}</h4>
                //         <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
                //         {c.content_type}
                //         </span>
                //     </div>

                //     <div className="mt-3">
                //         <span className="block text-gray-600 mb-2 font-medium">Assign to:</span>
                //         <div className="flex flex-wrap gap-3">
                //         {screens.map((s) => {
                //             // Find assigned content for this screen & this content only
                //             const isAssigned = assignments[s.id]?.some(
                //             (assigned) => assigned.id === c.id
                //             );

                //             return (
                //             <div key={`screen-${s.id}-content-${c.id}`} className="flex items-center gap-2">
                //                 {/* Assign / Unassign button */}
                //                 <button
                //                 onClick={() =>
                //                     isAssigned ? unassign(c.id, s.id) : assign(s.id, c.id)
                //                 }
                //                 className={`px-4 py-1 rounded-lg transition duration-200 ${
                //                     isAssigned
                //                     ? "bg-red-500 text-white hover:bg-red-600"
                //                     : "bg-blue-500 text-white hover:bg-blue-600"
                //                 }`}
                //                 >
                //                 {s.name}
                //                 </button>

                //                 {/* Show assigned label */}
                //                 {isAssigned && (
                //                 <span className="ml-2 px-2 py-1 bg-blue-100 rounded flex items-center gap-1">
                //                     Assigned
                //                 </span>
                //                 )}
                //             </div>
                //             );
                //         })}
                //         </div>
                //     </div>
                //     </li>
                // ))}
                // </ul>
                <ul className="space-y-6">
                {contents.map((c) => (
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

                        {/* 🗑️ DELETE BUTTON */}
                        <button
                        onClick={() => deleteContent(c.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-200"
                        >
                        Delete
                        </button>
                    </div>

                    <div className="mt-3">
                        <span className="block text-gray-600 mb-2 font-medium">Assign to:</span>
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
        </section>
    </div>
  );
}

export default Contents;
