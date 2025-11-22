"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  description?: string;
  location?: string;
  category?: "assignment" | "quiz" | "exam" | "class" | "reading" | "other";
}

type EventCategory = "assignment" | "quiz" | "exam" | "class" | "reading" | "other";

const categorizeEvent = (event: CalendarEvent): EventCategory => {
  const title = event.title.toLowerCase();
  const desc = (event.description || "").toLowerCase();
  const combined = title + " " + desc;

  if (combined.includes("exam") || combined.includes("midterm") || combined.includes("final")) return "exam";
  if (combined.includes("quiz")) return "quiz";
  if (combined.includes("assignment") || combined.includes("homework") || combined.includes(" due") || combined.includes("project")) return "assignment";
  if (combined.includes("reading") || combined.includes("chapter")) return "reading";
  if (combined.includes("class") || combined.includes("lecture")) return "class";
  return "other";
};

const categoryColors: Record<EventCategory, { bg: string; border: string; text: string; badge: string }> = {
  assignment: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", badge: "bg-blue-100 text-blue-800" },
  quiz: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", badge: "bg-purple-100 text-purple-800" },
  exam: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", badge: "bg-red-100 text-red-800" },
  class: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", badge: "bg-green-100 text-green-800" },
  reading: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-800" },
  other: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800", badge: "bg-gray-100 text-gray-800" },
};

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "text">("file");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
      setError("");

      // Track file selection
      track("file_selected", {
        fileCount: fileArray.length,
        fileTypes: fileArray.map(f => f.name.split('.').pop()).join(','),
        totalSize: fileArray.reduce((sum, f) => sum + f.size, 0)
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.doc')
    );

    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      setError("");

      // Track drag and drop
      track("file_dropped", {
        fileCount: droppedFiles.length,
        fileTypes: droppedFiles.map(f => f.name.split('.').pop()).join(',')
      });
    } else {
      setError("Please drop PDF or DOCX files only");
      track("file_drop_error", { reason: "invalid_file_type" });
    }
  };

  const loadSampleSyllabus = async () => {
    try {
      const response = await fetch("/sample-syllabus.txt");
      const sampleText = await response.text();
      setUploadMode("text");
      setText(sampleText);
      setError("");

      // Track sample usage
      track("sample_syllabus_loaded");
    } catch (err) {
      setError("Failed to load sample syllabus");
      track("sample_syllabus_error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEvents([]);
    setLoadingProgress("Preparing...");

    const startTime = Date.now();

    try {
      let allEvents: CalendarEvent[] = [];

      // Track upload start
      track("syllabus_upload_started", {
        mode: uploadMode,
        fileCount: uploadMode === "file" ? files.length : 0
      });

      if (uploadMode === "file" && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setLoadingProgress(`Processing file ${i + 1} of ${files.length}: ${file.name}...`);

          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/parse-syllabus", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to parse syllabus");
          }

          const data = await response.json();
          allEvents = [...allEvents, ...data.events];
        }
      } else if (uploadMode === "text" && text) {
        setLoadingProgress("Analyzing text with AI...");
        const formData = new FormData();
        formData.append("text", text);

        const response = await fetch("/api/parse-syllabus", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to parse syllabus");
        }

        const data = await response.json();
        allEvents = data.events;
      } else {
        throw new Error("Please provide a file or text");
      }

      setLoadingProgress("Categorizing events...");
      // Add categories to events
      const categorizedEvents = allEvents.map(event => ({
        ...event,
        category: categorizeEvent(event)
      }));

      setEvents(categorizedEvents);
      setLoadingProgress("Done!");

      // Track successful upload
      const processingTime = Date.now() - startTime;
      track("syllabus_upload_success", {
        mode: uploadMode,
        eventCount: categorizedEvents.length,
        processingTimeMs: processingTime,
        fileCount: uploadMode === "file" ? files.length : 0
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);

      // Track upload failure
      track("syllabus_upload_failed", {
        mode: uploadMode,
        error: errorMessage,
        processingTimeMs: Date.now() - startTime
      });
    } finally {
      setLoading(false);
      setLoadingProgress("");
    }
  };

  const handleEditEvent = (index: number) => {
    setEditingIndex(index);
    setEditingEvent({ ...events[index] });
    track("event_edit_started", { eventCategory: events[index].category || "other" });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingEvent) {
      const newEvents = [...events];
      newEvents[editingIndex] = editingEvent;
      setEvents(newEvents);
      setEditingIndex(null);
      setEditingEvent(null);
      track("event_edit_saved", { eventCategory: editingEvent.category || "other" });
    }
  };

  const handleDeleteEvent = (index: number) => {
    const deletedEvent = events[index];
    setEvents(events.filter((_, i) => i !== index));
    track("event_deleted", {
      eventCategory: deletedEvent.category || "other",
      remainingEvents: events.length - 1
    });
  };

  const handleDownloadICS = async () => {
    try {
      const response = await fetch("/api/generate-ics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate calendar file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "syllabus-calendar.ics";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track successful download
      track("calendar_downloaded", {
        eventCount: events.length,
        format: "ics"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to download calendar";
      setError(errorMessage);
      track("calendar_download_failed", { error: errorMessage });
    }
  };

  const addToGoogleCalendar = (event: CalendarEvent) => {
    const startDate = new Date(event.start);
    const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: event.description || "",
      location: event.location || "",
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank");

    // Track Google Calendar add
    track("google_calendar_add_clicked", {
      eventCategory: event.category || "other"
    });
  };

  // Calculate statistics
  const stats = events.reduce((acc, event) => {
    const category = event.category || "other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={() => setUploadMode("file")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            uploadMode === "file"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setUploadMode("text")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            uploadMode === "text"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={loadSampleSyllabus}
          className="px-6 py-2 rounded-lg font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          Try Sample
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {uploadMode === "file" ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
              multiple
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-600"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PDF, DOCX up to 10MB (multiple files supported)
              </p>
            </label>
            {files.length > 0 && (
              <div className="mt-4 space-y-1">
                {files.map((file, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    {idx + 1}. {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your syllabus text here..."
            rows={10}
            disabled={loading}
            className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        )}

        <button
          type="submit"
          disabled={loading || (uploadMode === "file" && files.length === 0) || (uploadMode === "text" && !text)}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {loadingProgress || "Processing..."}
            </>
          ) : (
            "Extract Calendar Events"
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-4">
          {/* Statistics */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Event Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats).map(([category, count]) => (
                <div key={category} className="text-center">
                  <div className={`${categoryColors[category as EventCategory].badge} rounded-lg p-3`}>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs capitalize mt-1">{category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Extracted Events ({events.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadICS}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Download .ics File
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {events.map((event, index) => {
              const category = event.category || "other";
              const colors = categoryColors[category];
              const isEditing = editingIndex === index;

              return (
                <div
                  key={index}
                  className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
                >
                  {isEditing && editingEvent ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        placeholder="Event title"
                      />
                      <input
                        type="datetime-local"
                        value={editingEvent.start.slice(0, 16)}
                        onChange={(e) => setEditingEvent({ ...editingEvent, start: e.target.value + ":00" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                      <textarea
                        value={editingEvent.description || ""}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        placeholder="Description"
                        rows={2}
                      />
                      <input
                        type="text"
                        value={editingEvent.location || ""}
                        onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        placeholder="Location"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingIndex(null); setEditingEvent(null); }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`${colors.badge} px-2 py-1 rounded text-xs font-medium capitalize`}>
                              {category}
                            </span>
                            <h3 className={`font-semibold ${colors.text}`}>
                              {event.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(event.start).toLocaleString()}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {event.description}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-sm text-gray-500 mt-1">
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => addToGoogleCalendar(event)}
                            className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap"
                            title="Add to Google Calendar"
                          >
                            + Google
                          </button>
                          <button
                            onClick={() => handleEditEvent(index)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
