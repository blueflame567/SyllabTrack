import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MeClient from "./MeClient";

export default async function MePage() {
  const authResult = await auth();
  const user = await currentUser();

  if (!authResult.userId) {
    redirect("/");
  }

  return <MeClient userId={authResult.userId} email={user?.emailAddresses?.[0]?.emailAddress || "N/A"} />;
}
