import React, { useEffect, useState } from "react";
import Api from "../../Api/Api";

function ScreenContainers() {
  const [screens, setScreens] = useState([]);
  const [containers, setContainers] = useState([]);
  const [containerName, setContainerName] = useState("");
  const [contentType, setContentType] = useState("image");
  const [transitionEffect, setTransitionEffect] = useState("fade");
  const [contentFiles, setContentFiles] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayMode, setDisplayMode] = useState("slide-view");


  const [errors, setErrors] = useState({}); // VALIDATION ERRORS
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;



  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchScreens();
    fetchContainers();
  }, []);

  async function fetchScreens() {
    try {
      const res = await fetch(`${Api}/api/v1/screens`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch screens");
      const data = await res.json();
      setScreens(data);
    } catch (err) {
      console.error("❌ Error fetching screens:", err);
    }
  }

  async function fetchContainers() {
    try {
      const res = await fetch(`${Api}/api/v1/screen_containers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("📦 Fetched containers:=================vfdgfgdget=================================", data);
      setContainers(data);
    } catch (err) {
      console.error("❌ Error fetching containers:", err);
    }
  }



  const validateForm = () => {
    let e = {};

    if (!containerName.trim()) e.name = "Container name is required";

    if (!contentType) e.contentType = "Select content type";

    // Validate Card Files
    if (!contentFiles || contentFiles.length === 0) {
      e.files = "Upload at least one card image";
    } else {
      Array.from(contentFiles).forEach((file) => {
        if (file.size > 100 * 1024 * 1024) {
          e.files = "Each file must be under 100MB";
        }
        if (contentType === "image" && !file.type.startsWith("image/")) {
          e.files = "Content type is Image, but file is not an image";
        }
        if (contentType === "video" && !file.type.startsWith("video/")) {
          e.files = "Content type is Video, but file is not a video";
        }
      });
    }

    // Validate Background File
    if (backgroundFile && backgroundFile.size > 100 * 1024 * 1024) {
      e.background = "Background file must be under 100MB";
    }
    if (
      backgroundFile &&
      !(
        backgroundFile.type.startsWith("image/") ||
        backgroundFile.type.startsWith("video/")
      )
    ) {
      e.background = "Background must be an image or video";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };


  // async function createContainer(e) {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", containerName);
  //     formData.append("content_type", contentType);
  //     formData.append("display_mode", displayMode);

  //     if (contentFiles) {
  //       Array.from(contentFiles).forEach(f => formData.append("files[]", f));
  //     }

  //     if (backgroundFile) {
  //       formData.append("background", backgroundFile);
  //     }

  //     const res = await fetch(`${Api}/api/v1/screen_containers`, {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}` },
  //       body: formData,
  //     });

  //     if (!res.ok) throw new Error("Upload failed");

  //     alert("Container Created!");
  //     fetchContainers();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error creating container");
  //   }

  //   setLoading(false);
  // }
  async function createContainer(e) {
    e.preventDefault();

    if (!validateForm()) return; // STOP IF INVALID

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", containerName);
      formData.append("content_type", contentType);
      formData.append("display_mode", displayMode);

      Array.from(contentFiles).forEach((f) => formData.append("files[]", f));

      if (backgroundFile) {
        formData.append("background", backgroundFile);
      }

      const res = await fetch(`${Api}/api/v1/screen_containers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create container");

      alert("Container Created!");
      fetchContainers();

      // Reset Form
      setContainerName("");
      setContentFiles(null);
      setBackgroundFile(null);
    } catch (err) {
      alert("Error creating container");
      console.error(err);
    }

    setLoading(false);
  }




  async function deleteContainer(containerId) {
    if (!window.confirm("Are you sure you want to delete this container?")) return;

    try {
      const res = await fetch(`${Api}/api/v1/screen_containers/${containerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);

      alert("Container deleted successfully!");
      fetchContainers(); // refresh list
    } catch (err) {
      console.error("❌ Error deleting container:", err);
      alert("Error deleting container");
    }
  }


  async function assignScreenToContainer(containerId, screenId) {
    await fetch(`${Api}/api/v1/screen_containers/${containerId}/assign_screen`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ screen_id: screenId }),
    });
    fetchContainers();
  }

  async function unassignScreenFromContainer(containerId, screenId) {
    await fetch(
      `${Api}/api/v1/screen_containers/${containerId}/unassign_screen?screen_id=${screenId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchContainers();
  }

  // 🖼️ Preview helper
  const renderFilePreview = (fileList) => {
    if (!fileList) return null;

    return Array.from(fileList).map((file, i) => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith("image/")) {
        return (
          <img
            key={i}
            src={url}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border"
          />
        );
      } else if (file.type.startsWith("video/")) {
        return (
          <video
            key={i}
            src={url}
            controls
            className="w-24 h-24 rounded-lg border"
          />
        );
      } else {
        return (
          <p key={i} className="text-gray-500 text-sm">
            {file.name}
          </p>
        );
      }
    });
  };


    // Pagination Calculations
  const totalPages = Math.ceil(containers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentContainers = containers.slice(indexOfFirst, indexOfLast);

  const handleNext = () =>
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  const handlePrev = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : p));





  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-gray-100/80 flex flex-col items-center justify-center rounded-2xl z-10">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            ></path>
          </svg>
          <span className="text-blue-700 font-medium">Uploading...</span>
        </div>
      )}

      <div className="p-6">
        {/* --- Create Container Section --- */}
        <section className="bg-white shadow-md rounded-2xl p-6 mb-10">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Create New Container
          </h3>
          <form onSubmit={createContainer} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block font-medium">Container Name</label>
              <input
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Content Type */}
            <div>
              <label className="block font-medium">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              {errors.contentType && (
                <p className="text-red-500 text-sm">{errors.contentType}</p>
              )}
            </div>

            {/* Card Files */}
            <div>
              <label className="block font-medium">Upload Card Images</label>
              <input
                type="file"
                multiple
                onChange={(e) => setContentFiles(e.target.files)}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
              {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}
            </div>

            {/* Background */}
            <div>
              <label className="block font-medium">Upload Background</label>
              <input
                type="file"
                onChange={(e) => setBackgroundFile(e.target.files[0])}
                className="w-full border border-dashed px-4 py-3 rounded-lg"
              />
              {errors.background && (
                <p className="text-red-500 text-sm">{errors.background}</p>
              )}
            </div>

            {/* Submit */}
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
              Create Container
            </button>
          </form>
        </section>

        {/* --- List of Containers --- */}
        <section className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Existing Containers
          </h3>

          {currentContainers.map((container) => (
            <div
              key={container.id}
              className="border rounded-lg p-4 mb-4 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                
                {/* Name */}
                <h4 className="text-lg font-semibold">{container.name}</h4>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <a
                    href={`/container/${container.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Open
                  </a>

                  <button
                    onClick={() => deleteContainer(container.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>

              </div>

              {/* Assign / Unassign */}
              <div className="flex flex-wrap gap-2 mb-3">
                {screens.map((s) => {
                  const assigned = container.screens?.some(
                    (sc) => sc.id === s.id
                  );

                  return (
                    <button
                      key={s.id}
                      onClick={() =>
                        assigned
                          ? unassignScreenFromContainer(container.id, s.id)
                          : assignScreenToContainer(container.id, s.id)
                      }
                      className={`px-4 py-2 rounded-lg text-white ${
                        assigned
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>

              {/* Assigned Screens */}
              <p className="text-sm text-gray-600">
                Assigned:{" "}
                {container.screens?.length
                  ? container.screens.map((sc) => sc.name).join(", ")
                  : "None"}
              </p>

            </div>
          ))}
          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Previous
            </button>

            <span className="font-bold">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Next
            </button>
          </div>
        </section>


      </div>
    </>
  );
}

export default ScreenContainers;

