import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navbar from "@/components/navbar-01/navbar-01";
import Hero from "@/components/hero-02/hero-02";

async function fetchBerita() {
  try {
    const res = await fetch("http://localhost:3000/api/berita", {
      cache: "no-store", // Ensure fresh data
    });
    if (!res.ok) {
      console.error("Failed to fetch berita:", res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching berita:", error);
    return [];
  }
}

export default async function Home() {
  const berita = await fetchBerita();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      <main className="flex-1 container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {berita.length > 0 ? (
            berita.map((item: any) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded mb-4"
                    onError={() =>
                      console.error(
                        `Failed to load image for ${item.title}: ${item.image}`
                      )
                    }
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">
                  {item.content.substring(0, 100)}...
                </p>
                <Button variant="link" asChild>
                  <a href={`/berita/${item.id}`}>Read More</a>
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No news available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
