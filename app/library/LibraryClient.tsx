"use client";

import { useState } from "react";
import { format } from "date-fns";
import * as ics from "ics";
import { saveAs } from "file-saver";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date | null;
  description: string | null;
  location: string | null;
  type: string | null;
}

interface Syllabus {
  id: string;
  fileName: string;
  fileType: string;
  courseName: string | null;
  createdAt: Date;
  events: Event[];
}

interface LibraryClientProps {
  syllabi: Syllabus[];
}

export default function LibraryClient({ syllabi }: LibraryClientProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["assignment", "quiz", "exam", "reading", "class", "other"]);
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);

  const eventTypes = [
    { value: "assignment", label: "Assignments", color: "bg-blue-100 text-blue-800" },
    { value: "quiz", label: "Quizzes", color: "bg-yellow-100 text-yellow-800" },
    { value: "exam", label: "Exams", color: "bg-red-100 text-red-800" },
    { value: "reading", label: "Readings", color: "bg-green-100 text-green-800" },
    { value: "class", label: "Classes", color: "bg-purple-100 text-purple-800" },
    { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
  ];

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const exportToICS = (syllabus: Syllabus, filterByType: boolean = true) => {
    const eventsToExport = filterByType
      ? syllabus.events.filter((e) => selectedTypes.includes(e.type || "other"))
      : syllabus.events;

    const icsEvents = eventsToExport.map((event) => {
      const startDate = new Date(event.start);
      const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000);

      return {
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ] as [number, number, number, number, number],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ] as [number, number, number, number, number],
        title: event.title,
        description: event.description || undefined,
        location: event.location || undefined,
      };
    });

    const { error, value } = ics.createEvents(icsEvents);

    if (error) {
      console.error(error);
      alert("Error creating calendar file");
      return;
    }

    const blob = new Blob([value || ""], { type: "text/calendar;charset=utf-8" });
    saveAs(blob, `${syllabus.fileName.replace(/\.[^/.]+$/, "")}-calendar.ics`);
  };

  const getEventTypeColor = (type: string | null) => {
    return eventTypes.find((t) => t.value === (type || "other"))?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Syllabus Library</h1>
          <p className="text-gray-600">View and manage all your uploaded syllabi</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">
            ← Back to Home
          </Link>
        </div>

        {/* Event Type Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Filter by Event Type:</h2>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => toggleType(type.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTypes.includes(type.value)
                    ? type.color
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Syllabi List */}
        {syllabi.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">No syllabi uploaded yet</p>
            <Link
              href="/"
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Upload Your First Syllabus
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {syllabi.map((syllabus) => {
              const filteredEvents = syllabus.events.filter((e) =>
                selectedTypes.includes(e.type || "other")
              );
              const isExpanded = expandedSyllabus === syllabus.id;

              return (
                <div key={syllabus.id} className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {syllabus.courseName || syllabus.fileName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Uploaded {format(new Date(syllabus.createdAt), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {filteredEvents.length} events ({syllabus.events.length} total)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportToICS(syllabus)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Export Filtered
                        </button>
                        <button
                          onClick={() => exportToICS(syllabus, false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Export All
                        </button>
                        <button
                          onClick={() =>
                            setExpandedSyllabus(isExpanded ? null : syllabus.id)
                          }
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {isExpanded ? "Hide" : "View"} Events
                        </button>
                      </div>
                    </div>

                    {/* Event List */}
                    {isExpanded && (
                      <div className="mt-6 border-t pt-4">
                        <div className="space-y-2">
                          {filteredEvents.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                                  <span className={`text-xs px-2 py-1 rounded ${getEventTypeColor(event.type)}`}>
                                    {event.type || "other"}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {format(new Date(event.start), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                                {event.description && (
                                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                          {filteredEvents.length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                              No events match the selected filters
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
