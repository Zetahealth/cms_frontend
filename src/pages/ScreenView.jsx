import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import api from "../lib/api";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable"; // ✅ Correct import

// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
const cable = ActionCable.createConsumer("ws://localhost:3000/cable");


function ScreenView() {
  const { slug } = useParams();
  const [contents, setContents] = useState([]);
  const token = sessionStorage.getItem("authToken");
  console.log("-------00000000000000-----------------slug slug----",slug )
  useEffect(() => {
    fetchContents();
    const subscription = cable.subscriptions.create(
      { channel: "ScreenChannel", slug },
      {
        received: (data) => {
          console.log("received", data);
          if (data.action === "assignment_changed" || data.action === "refresh") {
            fetchContents();
          }
        },
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [slug]);







  


    async function fetchContents() {
        try {
            const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });

            if (!res.ok) {
            throw new Error(`Failed to fetch contents: ${res.status}`);
            }

            const data = await res.json();
            console.log(data, "-----000000000000----------------0000000000--------------0000---")
            setContents(data);
        } catch (err) {
            console.error("❌ Error fetching contents:", err);
        }
    }

  return (
    <div
      style={{
        background: "#0b1020",
        color: "white",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <h1>Screen: {slug}</h1>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {contents.map((c) => (
          <div
            key={c.id}
            style={{
              width: 420,
              background: "#111224",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <h3>{c.title}</h3>
            {c.content_type === "image" &&
              c.files.map((f, i) => <img key={i} src={f} style={{ maxWidth: "100%" }} />)}
            {c.content_type === "video" &&
              c.files.map((f, i) => (
                <video key={i} controls style={{ width: "100%" }}>
                  <source src={f} />
                </video>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScreenView;
