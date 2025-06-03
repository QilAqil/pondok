import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navbar from "@/components/navbar-01/navbar-01";
import Hero from "@/components/hero-02/hero-02";

async function fetchBerita() {
  try {
    // Use absolute URL for the API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/berita`;
    
    console.log('Fetching from URL:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 0 },
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('Fetched berita:', data);
    
    if (!Array.isArray(data)) {
      console.error('Invalid data format:', data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching berita:", error);
    return [];
  }
}

export default async function Home() {
  console.log('Home page rendering...');
  const berita = await fetchBerita();
  console.log('Berita in component:', berita);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Berita Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {berita && Array.isArray(berita) && berita.length > 0 ? (
              berita.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {item.image && item.image !== "" ? (
                    <div className="relative w-full h-56">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="default" 
                        className="bg-blue-600 hover:bg-blue-700"
                        asChild
                      >
                        <a href={`/berita/${item.id}`}>Baca Selengkapnya</a>
                      </Button>
                      <span className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Belum ada berita yang tersedia.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
