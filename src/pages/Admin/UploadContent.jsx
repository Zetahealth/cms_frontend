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
import React, { useState } from "react";
import Api from "../../Api/Api";

function UploadContent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("image");
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState("Center"); // ✅ Added position
  const token = sessionStorage.getItem("authToken");
  const [hyperlink, setHyperlink] = useState("");

  async function upload(e) {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      form.append("content_type", contentType);
      form.append("position", position); // ✅ Send position to backend
      form.append("hyperlink", hyperlink);

      if (file) for (const f of file) form.append("files[]", f);

      const res = await fetch(`${Api}/api/v1/contents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      alert("✅ Content uploaded successfully!");
      setTitle("");
      setContent("");
      setFile(null);
      setPosition("Center");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload content. Check console for details.");
    }
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Upload Content</h3>

      <form onSubmit={upload} className="space-y-4">
        {/* --- Title --- */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter content title"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* --- Description / Content --- */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content details"
            className="w-full border rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* --- Content Type --- */}
        <div>
          <label className="block font-medium mb-1">Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="html">HTML</option>
          </select>
        </div>

        {/* --- Position --- */}
        <div>
          <label className="block font-medium mb-1">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Top-Left">Top-Left</option>
            <option value="Top-Right">Top-Right</option>
            <option value="Bottom-Left">Bottom-Left</option>
            <option value="Bottom-Right">Bottom-Right</option>
            <option value="Center">Center</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">External Link (for QR)</label>
          <input
            type="url"
            value={hyperlink}
            onChange={(e) => setHyperlink(e.target.value)}
            placeholder="Enter external link (optional)"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* --- File Upload --- */}
        <div>
          <label className="block font-medium mb-1">Upload Files</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFile(e.target.files)}
            className="block w-full text-gray-600 border border-dashed border-gray-400 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100"
          />
        </div>

        {/* --- Submit --- */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition duration-200"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadContent;
