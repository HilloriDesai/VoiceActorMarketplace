"use client";

import { useRouter } from "next/navigation";
import ActorForm from "@/components/actors/ActorForm/ActorForm";

export default function NewActorPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/"); // Redirect to homepage after successful submission
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Add New Voice Actor</h1>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <ActorForm onClose={() => router.push("/")} onSuccess={handleSuccess} />
      </div>
    </main>
  );
}
