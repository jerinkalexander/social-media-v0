"use client"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-[#1877f2]">{"Social Media App"}</h1>
      <p className="text-center text-lg text-gray-600 max-w-md">
        {
          "Welcome! Your mobile-first social media MVP is ready. Open the app on iOS, Android, or the web tabs above to start posting."
        }
      </p>
    </main>
  )
}
