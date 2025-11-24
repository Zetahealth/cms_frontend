// import React, { useState, useEffect } from "react";
// import Api from "../../Api/Api";

// export default function SubContentForm({ parentContentId, editing, onSaved }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [mainImage, setMainImage] = useState(null);
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [qr, setQr] = useState(null);
//   const [fileResetKey, setFileResetKey] = useState(Date.now());


//   const token = sessionStorage.getItem("authToken");

//   // Prefill when editing
//   useEffect(() => {
//     if (editing) {
//       setTitle(editing.title);
//       setDescription(editing.description);
//       setMainImage(null);
//       setGalleryImages([]);
//     }
//   }, [editing]);

//   const submitSubContent = async (e) => {
//     e.preventDefault();
//     if (!parentContentId) return alert("Select a content first!");

//     const form = new FormData();
//     form.append("title", title);
//     form.append("description", description);
//     form.append("content_id", parentContentId);

//     if (mainImage) form.append("main_image", mainImage);
//     if (qr) form.append("qr_code", qr);

//     Array.from(galleryImages).forEach((img) =>
//       form.append("gallery_images[]", img)
//     );

//     const method = editing ? "PUT" : "POST";
//     const url = editing
//       ? `${Api}/api/v1/sub_contents/${editing.id}`
//       : `${Api}/api/v1/sub_contents`;

//     await fetch(url, {
//       method,
//       headers: { Authorization: `Bearer ${token}` },
//       body: form
//     });

//     alert("Saved!");
//     setTitle("");
//     setDescription("");
//     setMainImage(null);
//     setGalleryImages([]);
//     setQr(null);
//     setFileResetKey(Date.now());


//     onSaved();
//   };

//   return (
//     <div className="bg-white shadow-md rounded-2xl p-6 mt-8">
//       <h3 className="text-xl font-bold mb-4">
//         {editing ? "Edit Sub Content" : "Create Sub Content"}
//       </h3>

//       <form className="space-y-5" onSubmit={submitSubContent}>
//         <div>
//           <label className="font-semibold">Title</label>
//           <input
//             className="w-full border p-2 rounded"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="font-semibold">Description</label>
//           <textarea
//             className="w-full border p-2 rounded"
//             rows={4}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="font-semibold">BackGround</label>
//           {/* <input type="file" onChange={(e) => setMainImage(e.target.files[0])} 
//             className="w-full border border-dashed px-4 py-3 rounded-lg"
//           /> */}

//           <input
//             key={fileResetKey + "-main"}
//             type="file"
//             onChange={(e) => setMainImage(e.target.files[0])}
//             className="w-full border border-dashed px-4 py-3 rounded-lg"
//           />
//         </div>

//         <div>
//           <label className="font-semibold">Gallery Images</label>

//           <input
//             key={fileResetKey + "-gallery"}
//             type="file"
//             multiple
//             onChange={(e) => setGalleryImages(e.target.files)}
//             className="w-full border border-dashed px-4 py-3 rounded-lg"
//           />
          
//         </div>

//         <button className="bg-blue-600 text-white px-6 py-2 rounded">
//           {editing ? "Update" : "Create"}
//         </button>
//       </form>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import Api from "../../Api/Api";

export default function SubContentForm({ parentContentId, editing, onSaved }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [qr, setQr] = useState(null);
  const [fileResetKey, setFileResetKey] = useState(Date.now());

  // NEW STATES
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = sessionStorage.getItem("authToken");

  // Prefill on edit
  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setDescription(editing.description || "");
      setMainImage(null);
      setGalleryImages([]);
    }
  }, [editing]);

  // --------------------------
  // VALIDATION FUNCTION
  // --------------------------
  const validate = () => {
    const err = {};

    if (!title.trim()) err.title = "Title is required";
    if (!description.trim()) err.description = "Description is required";
    if (!parentContentId) err.parent = "Select a content first";

    if (!editing && !mainImage) {
      err.mainImage = "Main Image is required for creating new content";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // --------------------------
  // SUBMIT HANDLER
  // --------------------------
  const submitSubContent = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("content_id", parentContentId);

    if (mainImage) form.append("main_image", mainImage);
    if (qr) form.append("qr_code", qr);

    Array.from(galleryImages).forEach((img) =>
      form.append("gallery_images[]", img)
    );

    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${Api}/api/v1/sub_contents/${editing.id}`
      : `${Api}/api/v1/sub_contents`;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Saved!");

      // Reset form
      setTitle("");
      setDescription("");
      setMainImage(null);
      setGalleryImages([]);
      setQr(null);
      setFileResetKey(Date.now());

      onSaved();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="relative bg-white shadow-md rounded-2xl p-6 mt-8">

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

      <h3 className="text-xl font-bold mb-4">
        {editing ? "Edit Sub Content" : "Create Sub Content"}
      </h3>

      <form className="space-y-5" onSubmit={submitSubContent}>
        {/* Title */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Main Image */}
        <div>
          <label className="font-semibold">Background Image</label>
          <input
            key={fileResetKey + "-main"}
            type="file"
            onChange={(e) => setMainImage(e.target.files[0])}
            className="w-full border border-dashed px-4 py-3 rounded-lg"
          />
          {errors.mainImage && (
            <p className="text-red-600 text-sm mt-1">{errors.mainImage}</p>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <label className="font-semibold">Gallery Images</label>
          <input
            key={fileResetKey + "-gallery"}
            type="file"
            multiple
            onChange={(e) => setGalleryImages(e.target.files)}
            className="w-full border border-dashed px-4 py-3 rounded-lg"
          />
        </div>

        {/* Parent ID error */}
        {errors.parent && (
          <p className="text-red-600 text-sm mt-1">{errors.parent}</p>
        )}

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300"
        >
          {editing ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
