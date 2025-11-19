import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LibraryClient from "./LibraryClient";

// Add metadata for better SEO and page title
export const metadata = {
  title: "Syllabus Library | SyllabTrack",
  description: "View and manage all your uploaded syllabi",
};

export default async function LibraryPage() {
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
