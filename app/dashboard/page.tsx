// load page
//  → get user
//  → fetch bookmarks
//  → show list

// add bookmark
//  → insert
//  → fetch again
//  → UI updates

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // 🔹 Load user + bookmarks
  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) return;

      fetchBookmarks();
    };

    loadData();
  }, []);

  // This is done to achieve step 4 i.e. Bookmark list updates in real-time without page refresh (if you open two tabs and add a bookmark in one, it should appear in the other)
  useEffect(() => {
  const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks(); // refetch whenever table changes
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  // 🔹 Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBookmarks(data || []);
  };

  // 🔹 Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      title,
      url,
    });

    if (error) {
      alert("Error adding bookmark");
      return;
    }

    setTitle("");
    setUrl("");

    // 🔥 IMPORTANT: refresh list after insert
    fetchBookmarks();
  };

  // 🔹 Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed");
      console.log(error);
    }
  };

  // handles Logout 
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Refresh to show the login screen again
  };

  if (loading) return <p className="p-10 text-white">Loading...</p>;

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <p className="text-2xl mb-4 text-gray-400">You are logged out.</p>
        <a href="/" className="text-emerald-500 border-b mb-2 hover:scale-105 duration-200">Return to Homepage</a>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Logged in as: {user.email}</p>

      {/* FORM */}
      <div className="space-y-2 mt-6">
        <input
          className="border p-2 mr-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className="bg-black w-fit ml-2 text-white px-4 py-2 cursor-pointer hover:scale-95 duration-200 "
        >
          Add Bookmark
        </button>
      </div>

      {/* LIST */}
      <h2 className="mt-6 font-bold">Your bookmarks :- </h2>

      {/* Render Bookmarks i.e. display inserted Bookmarks */}
      {/* Delete Button UI */}
      {bookmarks.map((b) => (
        <div key={b.id} className="w-[50%] mt-2 flex justify-between border-b pb-1">
          
          <div>
            <p>{b.title}</p>
            <a href={b.url} target="_blank">{b.url}</a>
          </div>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500 cursor-pointer border border-gray-500 rounded-md px-2 mb-2 hover:scale-105 duration-200"
          >
            Delete
          </button>

        </div>
      ))}

      {/* Logout Button UI */}
      <div className="flex items-center w-[50%] justify-end">
        <button 
          onClick={handleLogout}
          className="border p-2 px-5 hover:scale-95 duration-200 rounded-md border-gray-600 mt-5  cursor-pointer"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
