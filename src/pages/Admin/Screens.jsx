// import React, { useState, useEffect } from "react";
// import Api from "../../Api/Api";

// function Screens() {
//   const [screens, setScreens] = useState([]);
//   const [screenName, setScreenName] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedScreen, setSelectedScreen] = useState(null);
//   const [backgroundFile, setBackgroundFile] = useState(null);
//   const token = sessionStorage.getItem("authToken");

//   useEffect(() => {
//     fetchScreens();
//   }, []);

//   async function fetchScreens() {
//     const res = await fetch(`${Api}/api/v1/screens`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setScreens(data);
//   }

//   async function createScreen(e) {
//     e.preventDefault();
//     await fetch(`${Api}/api/v1/screens`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name: screenName }),
//     });
//     setScreenName("");
//     fetchScreens();
//   }

//   async function deleteScreen(screenId) {
//     if (!window.confirm("Are you sure?")) return;
//     await fetch(`${Api}/api/v1/screens/${screenId}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchScreens();
//   }

//   async function uploadBackground(e) {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("background", backgroundFile);
//     await fetch(`${Api}/api/v1/screens/${selectedScreen.id}/upload_background`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });
//     alert("✅ Background uploaded");
//     setShowPopup(false);
//     setBackgroundFile(null);
//     fetchScreens();
//   }

//   return (
//     <div className="bg-white shadow-md rounded-2xl p-6">
//       <h3 className="text-2xl font-semibold mb-4 text-gray-700">Screens</h3>

//       <form onSubmit={createScreen} className="flex gap-3 mb-6">
//         <input
//           value={screenName}
//           onChange={(e) => setScreenName(e.target.value)}
//           placeholder="Enter screen name"
//           className="border rounded-lg px-4 py-2 flex-1"
//         />
//         <button
//           type="submit"
//           className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
//         >
//           Create
//         </button>
//       </form>



//       <ul className="space-y-4">
//         {screens.map((s) => (
//           <li key={s.id} className="border-b pb-2 flex justify-between items-center">
//             <span className="font-medium">{s.name}</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => deleteScreen(s.id)}
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => {
//                   setSelectedScreen(s);
//                   setShowPopup(true);
//                 }}
//                 className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//               >
//                 Upload Background
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {showPopup && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 shadow-lg w-96 relative">
//             <h3 className="text-xl font-bold mb-4">
//               Upload Background for {selectedScreen?.name}
//             </h3>

//             <form onSubmit={uploadBackground} className="space-y-4">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setBackgroundFile(e.target.files[0])}
//                 className="w-full border rounded-lg p-2"
//               />
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowPopup(false)}
//                   className="bg-gray-300 px-4 py-2 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Upload
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}


//     </div>
//   );
// }

// export default Screens;
import React, { useState, useEffect } from "react";
import Api from "../../Api/Api";

function Screens() {
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
    // async function deleteScreen(screenId) {
    //     if(!window.confirm("Are you sure to delete screen?")) return;
    //     await fetch(`${Api}/api/v1/screens/${screenId}`, { method: "DELETE", headers: {"Authorization": `Bearer ${token}`} });
    //     fetchScreens();
    // }

    async function deleteContent(contentId) {
        if(!window.confirm("Are you sure to delete content?")) return;
        await fetch(`${Api}/api/v1/contents/${contentId}`, { method: "DELETE", headers: {"Authorization": `Bearer ${token}`} });
        fetchContents();
        fetchAssignments();
    }

    async function deleteScreen(screenId) {
        if(!window.confirm("Are you sure you want to delete this screen? (Note: please remove the screen from the container if it is assigned.)")) return;
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
    <div className="bg-white shadow-md rounded-2xl p-6">
      {/* <h3 className="text-2xl font-semibold mb-4 text-gray-700">📺 Screens</h3> */}

        <section >
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Create New Screen</h3>
                <form onSubmit={createScreen} className="flex gap-3">
                    <input
                    value={screenName}
                    onChange={(e) => setScreenName(e.target.value)}
                    placeholder="Enter screen name"
                    className="border rounded-lg px-4 py-2 flex-1"
                    />
                    <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                    Create
                    </button>
                </form>
        </section>

        <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Availabe Screens</h3>
            {screens.length === 0 ? (
                <p className="text-gray-500">No screens available.</p>
            ) : (
                <ul className="space-y-2">
                {screens.map((s) => (
                    <li key={s.id} className="border-b pb-2 mb-2 flex justify-between items-center">
                        <div>
                            <div className="flex gap-4 items-center">
                                <span className="font-medium">{s.name}</span>
                                <a
                                href={`/screen/${s.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                                >
                                Open
                                </a>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Assigned Content: 
                                {assignments[s.id]?.length ? (
                                    assignments[s.id].map(c => <span key={c.id} className="ml-2 px-2 py-1 bg-blue-100 rounded">{c.title}</span>)
                                ) : (
                                    <span className="ml-2">None</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Delete Button */}
                            <button
                            onClick={() => deleteScreen(s.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                            >
                            Delete
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedScreen(s);
                                    setShowPopup(true);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                Upload Background
                            </button>
                        </div>
                        
                    </li>
                ))}
                </ul>
            )}
        </section>

        {/* ✅ Popup Modal */}
        {showPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-96 relative">
                <h3 className="text-xl font-bold mb-4">
                Upload Background for {selectedScreen?.name}
                </h3>

                <form onSubmit={uploadBackground} className="space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBackgroundFile(e.target.files[0])}
                    className="w-full border rounded-lg p-2"
                />
                <div className="flex justify-end gap-3">
                    <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                    Upload
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
    </div>
  );
}

export default Screens;
