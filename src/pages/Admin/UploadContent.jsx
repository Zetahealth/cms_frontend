// import React, { useState } from "react";
// import Api from "../../Api/Api";

// function UploadContent() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [contentType, setContentType] = useState("image");
//   const [file, setFile] = useState(null);
//   const token = sessionStorage.getItem("authToken");

//   async function upload(e) {
//     e.preventDefault();
//     try {
//       const form = new FormData();
//       form.append("title", title);
//       form.append("content", content);
//       form.append("content_type", contentType);
//       if (file) for (const f of file) form.append("files[]", f);

//       const res = await fetch(`${Api}/api/v1/contents`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });

//       if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
//       alert("✅ Content uploaded successfully!");
//       setTitle("");
//       setContent("");
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   return (
//     <div className="bg-white shadow-md rounded-2xl p-6">
//       <h3 className="text-2xl font-semibold mb-4 text-gray-700">Upload Content</h3>
//       <form onSubmit={upload} className="space-y-4">
//         <div>
//           <label className="block font-medium mb-1">Title</label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter content title"
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Content</label>
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Enter content details"
//             className="w-full border rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Content Type</label>
//           <select
//             value={contentType}
//             onChange={(e) => setContentType(e.target.value)}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="image">Image</option>
//             <option value="video">Video</option>
//             <option value="html">HTML</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Upload Files</label>
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setFile(e.target.files)}
//             className="block w-full text-gray-600 border border-dashed border-gray-400 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition duration-200"
//         >
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// }

// export default UploadContent;
// import React, { useState } from "react";
// import Api from "../../Api/Api";

// function UploadContent() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [contentType, setContentType] = useState("image");
//   const [file, setFile] = useState(null);
//   const [position, setPosition] = useState("Center"); // ✅ Added position
//   const token = sessionStorage.getItem("authToken");
//   const [hyperlink, setHyperlink] = useState("");
//   const [transitionEffect, setTransitionEffect] = useState("fade");

//   async function upload(e) {
//     e.preventDefault();
//     try {
//       const form = new FormData();
//       form.append("title", title);
//       form.append("content", content);
//       form.append("content_type", contentType);
//       form.append("position", position); // ✅ Send position to backend
//       form.append("hyperlink", hyperlink);
//       form.append("transition_effect", transitionEffect);

//       if (file) for (const f of file) form.append("files[]", f);

//       const res = await fetch(`${Api}/api/v1/contents`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });

//       if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
//       alert("✅ Content uploaded successfully!");
//       setTitle("");
//       setContent("");
//       setFile(null);
//       setPosition("Center");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to upload content. Check console for details.");
//     }
//   }

//   return (
//     <div className="bg-white shadow-md rounded-2xl p-6">
//       <h3 className="text-2xl font-semibold mb-4 text-gray-700">Upload Content</h3>

//       <form onSubmit={upload} className="space-y-4">
//         {/* --- Title --- */}
//         <div>
//           <label className="block font-medium mb-1">Title</label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter content title"
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* --- Description / Content --- */}
//         <div>
//           <label className="block font-medium mb-1">Content</label>
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Enter content details"
//             className="w-full border rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* --- Content Type --- */}
//         <div>
//           <label className="block font-medium mb-1">Content Type</label>
//           <select
//             value={contentType}
//             onChange={(e) => setContentType(e.target.value)}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="image">Image</option>
//             <option value="video">Video</option>
//             {/* <option value="html">HTML</option> */}
//           </select>
//         </div>

//         {/* --- Position --- */}
//         <div>
//           <label className="block font-medium mb-1">Position</label>
//           <select
//             value={position}
//             onChange={(e) => setPosition(e.target.value)}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="Top-Left">Top-Left</option>
//             <option value="Top-Right">Top-Right</option>
//             <option value="Bottom-Left">Bottom-Left</option>
//             <option value="Bottom-Right">Bottom-Right</option>
//             <option value="Center">Center</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">External Link (for QR)</label>
//           <input
//             type="url"
//             value={hyperlink}
//             onChange={(e) => setHyperlink(e.target.value)}
//             placeholder="Enter external link (optional)"
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         <div >
//           <label className="block font-medium mb-1">Transition Effect</label>
//         <select
//           value={transitionEffect}
//           onChange={(e) => setTransitionEffect(e.target.value)}
//           className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"

//         >
//           <option value="fade">Fade</option>
//           <option value="zoom">Zoom</option>
//           <option value="slide-left">Slide from Left</option>
//           <option value="slide-right">Slide from Right</option>
//           <option value="slide-up">Slide Up</option>
//           {/* <option value="rotate">Rotate</option> */}
//         </select>
//         </div>




//         {/* --- File Upload --- */}
//         <div>
//           <label className="block font-medium mb-1">Upload Files</label>
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setFile(e.target.files)}
//             className="block w-full text-gray-600 border border-dashed border-gray-400 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100"
//           />
//         </div>

//         {/* --- Submit --- */}
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition duration-200"
//         >
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// }

// export default UploadContent;
import React, { useState , useEffect} from "react";
import Api from "../../Api/Api";
import SubContentForm from "./SubContentForm"

function UploadContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("image");
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState("Center");
  const [hyperlink, setHyperlink] = useState("");
  const [transitionEffect, setTransitionEffect] = useState("fade");
  const [loading, setLoading] = useState(false); // ✅ loader state
  const [errors, setErrors] = useState({});
  const [logo, setLogo] = useState(null);



  const token = sessionStorage.getItem("authToken");



  const [allContents, setAllContents] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [subContents, setSubContents] = useState([]);
  const [editingSubContent, setEditingSubContent] = useState(null);

  // Load all contents
  useEffect(() => {
    fetch(`${Api}/api/v1/contents`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAllContents);
  }, []);

  // Load sub-contents for selected content
  useEffect(() => {
    if (!selectedContentId) return;

    fetch(`${Api}/api/v1/sub_contents?content_id=${selectedContentId}`)
      .then(res => res.json())
      .then(setSubContents);
  }, [selectedContentId]);


  async function upload(e) {
    e.preventDefault();
    setLoading(true);

    let validationErrors = {};

    // Title required
    if (!title.trim()) validationErrors.title = "Title is required";

    // Content type required
    if (!contentType) validationErrors.contentType = "Content type is required";

    // Optional Logo Validation
    if (logo && logo.length > 0) {
      Array.from(logo).forEach((lg) => {
        if (!lg.type.startsWith("image/")) {
          validationErrors.logo = "Logo must be an image file";
        }
        if (lg.size > 5 * 1024 * 1024) {
          validationErrors.logo = "Logo must be under 5MB";
        }
      });
    }


    // File required
    if (!file || file.length === 0) {
      validationErrors.file = "You must upload one file";
    } else {
      // Validate each file
      Array.from(file).forEach((f) => {
        if (f.size > 100 * 1024 * 1024) {
          validationErrors.file = "Each file must be under 100 MB";
        }
        if (contentType === "image" && !f.type.startsWith("image/")) {
          validationErrors.file = "Selected content type is Image but file is not an image";
        }
        if (contentType === "video" && !f.type.startsWith("video/")) {
          validationErrors.file = "Selected content type is Video but file is not a video";
        }
      });
    }

    // URL format validation
    if (hyperlink && !/^https?:\/\/\S+$/.test(hyperlink)) {
      validationErrors.hyperlink = "Enter a valid URL starting with http:// or https://";
    }

    // Show errors and stop
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({}); // Clear errors if all good

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      form.append("content_type", contentType);
      form.append("position", position);
      form.append("hyperlink", hyperlink);
      form.append("transition_effect", transitionEffect);

      if (logo && logo.length > 0) {
        Array.from(logo).forEach((lg) => form.append("logo", lg));
      }

      Array.from(file).forEach((f) => form.append("files", f));

      const res = await fetch(`${Api}/api/v1/contents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("✅ Content uploaded successfully!");

      // Reset fields
      setTitle("");
      setContent("");
      setFile(null);
      setPosition("Center");
      setHyperlink("");
      setTransitionEffect("fade");
      setLogo(null);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed! Check console.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubContent(id) {
    if (!window.confirm("Delete this sub-content?")) return;

    await fetch(`${Api}/api/v1/sub_contents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setSubContents((prev) => prev.filter((s) => s.id !== id));
  }



  return (
    <>
    <div className="bg-white shadow-md rounded-2xl p-6 relative">
      {/* Loader Overlay */}
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

      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Upload Content</h3>

      <form onSubmit={upload} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter content title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 h-32"
          />
        </div>

        {/* Content Type */}
        <div>
          <label className="block font-medium mb-1">Content Type</label>
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

        {/* Position */}
        <div>
          <label className="block font-medium mb-1">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="Top-Left">Top-Left</option>
            <option value="Top-Right">Top-Right</option>
            <option value="Bottom-Left">Bottom-Left</option>
            <option value="Bottom-Right">Bottom-Right</option>
            <option value="Center">Center</option>
          </select>
        </div>

        {/* Hyperlink */}
        <div>
          <label className="block font-medium mb-1">External Link (for QR)</label>
          <input
            type="url"
            value={hyperlink}
            onChange={(e) => setHyperlink(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter valid URL"
          />
          {errors.hyperlink && (
            <p className="text-red-500 text-sm">{errors.hyperlink}</p>
          )}
        </div>

        {/* Transition Effect */}
        <div>
          <label className="block font-medium mb-1">Transition Effect</label>
          <select
            value={transitionEffect}
            onChange={(e) => setTransitionEffect(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="fade">Fade</option>
            <option value="zoom">Zoom</option>
            <option value="slide-left">Slide Left</option>
            <option value="slide-right">Slide Right</option>
            <option value="slide-up">Slide Up</option>
          </select>
        </div>


        {/* Logo Upload (Optional) */}
        <div>
          <label className="block font-medium mb-1">
            Upload Logo (Optional)
          </label>
          
          <input
            type="file"
            onChange={(e) => setLogo(e.target.files)}
            className="w-full border border-dashed px-4 py-3 rounded-lg"
          />

          {errors.logo && (
            <p className="text-red-500 text-sm">{errors.logo}</p>
          )}
        </div>


        {/* File Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Files</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFile(e.target.files)}
            className="w-full border border-dashed px-4 py-3 rounded-lg"
          />
          {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

      </form>

      
    </div>
    {/* SELECT CONTENT DROPDOWN */}
    <div className="bg-white shadow-md rounded-2xl p-6 mt-10">
      <h3 className="text-xl font-semibold mb-3">Select Content to Manage Sub-Contents</h3>

      <select
        className="border px-4 py-2 rounded w-full"
        value={selectedContentId || ""}
        onChange={(e) => setSelectedContentId(e.target.value)}
      >
        <option value="">-- Select Content --</option>
        {allContents.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
    </div>
    {selectedContentId && (
      <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Sub-Contents</h3>

        {subContents.length === 0 ? (
          <p className="text-gray-500">No sub-contents yet.</p>
        ) : (
          <ul className="space-y-4">
            {subContents.map((sub) => (
              <li
                key={sub.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{sub.title}</p>
                  <p className="text-gray-600 text-sm">{sub.description?.slice(0, 50)}...</p>
                </div>

                <div className="flex gap-3">
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                    onClick={() => setEditingSubContent(sub)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => deleteSubContent(sub.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    <SubContentForm
      parentContentId={selectedContentId}
      editing={editingSubContent}
      onSaved={() => {
        setEditingSubContent(null);
        // reload sub contents
        fetch(`${Api}/api/v1/sub_contents?content_id=${selectedContentId}`)
          .then(res => res.json())
          .then(setSubContents);
      }}
    />



    </>
  );
}

export default UploadContent;
