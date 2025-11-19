import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LibraryClient from "./LibraryClient";
import { Suspense } from "react";

// Add metadata for better SEO and page title
export const metadata = {
  title: "Syllabus Library | SyllabTrack",
  description: "View and manage all your uploaded syllabi",
};

async function LibraryData() {
  const authResult = await auth();

  if (!authResult.userId) {
    redirect("/");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: authResult.userId },
  });

  if (!user) {
    redirect("/");
  }

  // Fetch all syllabi for this user with their events
  // Optimized query to reduce data transfer
  const syllabi = await prisma.syllabus.findMany({
    where: { userId: user.id },
    include: {
      events: {
        orderBy: { start: "asc" },
        select: {
          id: true,
          title: true,
          start: true,
          end: true,
          description: true,
          location: true,
          type: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <LibraryClient syllabi={syllabi} />;
}

export default function LibraryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
        </div>
      </div>
    }>
      <LibraryData />
    </Suspense>
  );
}
