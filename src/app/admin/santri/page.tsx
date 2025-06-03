"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/components/UploadButton";
import axios from "axios";

const santriSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export default function SantriPage() {
  const [santri, setSantri] = useState([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(santriSchema),
  });

  useEffect(() => {
    fetchSantri();
  }, []);

  const fetchSantri = async () => {
    const response = await axios.get("/api/santri");
    setSantri(response.data);
  };

  const onSubmit = async (data: any) => {
    await axios.post("/api/santri", { ...data, photo: photoUrl });
    reset();
    setPhotoUrl(null);
    fetchSantri();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/santri?id=${id}`);
    fetchSantri();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Santri</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <Input {...register("name")} placeholder="Name" className="mb-2" />
        <Input {...register("email")} placeholder="Email" className="mb-2" />
        <UploadButton setPhotoUrl={setPhotoUrl} />
        <Button type="submit">Add Santri</Button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {santri.map((s: any) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                {s.photo ? <img src={s.photo} alt="Santri" width={50} /> : "-"}
              </td>
              <td>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
