import { NextRequest, NextResponse } from "next/server";
import { createEvents, EventAttributes } from "ics";

interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  description?: string;
  location?: string;
}

function parseISODate(isoString: string): [number, number, number, number, number] {
  const date = new Date(isoString);
  return [
    date.getFullYear(),
    date.getMonth() + 1, // ics expects 1-12, not 0-11
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
}

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json() as { events: CalendarEvent[] };

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "No events provided" },
        { status: 400 }
      );
    }

    const icsEvents: EventAttributes[] = events.map((event) => {
      const startDate = parseISODate(event.start);
      const endDate = event.end ? parseISODate(event.end) : (() => {
        const end = new Date(event.start);
        end.setHours(end.getHours() + 1);
        return parseISODate(end.toISOString());
      })();

      const icsEvent: EventAttributes = {
        title: event.title,
        start: startDate,
        end: endDate,
        startInputType: "local",
        startOutputType: "local",
        endInputType: "local",
        endOutputType: "local",
        alarms: [
          {
            action: "display",
            trigger: { hours: 24, before: true },
            description: `Reminder: ${event.title}`,
          },
        ],
      };

      if (event.description) {
        icsEvent.description = event.description;
      }

      if (event.location) {
        icsEvent.location = event.location;
      }

      return icsEvent;
    });

    const { error, value } = createEvents(icsEvents);

    if (error) {
      console.error("Error creating ICS file:", error);
      return NextResponse.json(
        { error: "Failed to generate calendar file" },
        { status: 500 }
      );
    }

    return new NextResponse(value, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": 'attachment; filename="syllabus-calendar.ics"',
      },
    });
  } catch (error) {
    console.error("Error generating ICS:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate calendar file" },
      { status: 500 }
    );
  }
}
