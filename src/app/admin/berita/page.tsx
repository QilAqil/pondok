'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CustomUploadButton from "@/components/UploadButton";
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';

const beritaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export default function BeritaPage() {
  const [berita, setBerita] = useState([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(beritaSchema),
  });

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    try {
      const response = await axios.get('/api/berita');
      setBerita(response.data);
    } catch (error) {
      console.error('Error fetching berita:', error);
      alert('Error fetching berita. Please refresh the page.');
    }
  };

  const onSubmit = async (data: any) => {
    if (!userId) {
      alert('You must be logged in to add/edit berita');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        image: imageUrl || null,
        authorId: userId,
      };

      console.log('Submitting form data:', formData);

      let response;
      if (editingId) {
        response = await axios.put(`/api/berita?id=${editingId}`, formData);
        console.log('Update response:', response.data);
      } else {
        response = await axios.post('/api/berita', formData);
        console.log('Create response:', response.data);
      }
      
      reset();
      setImageUrl(undefined);
      setEditingId(null);
      await fetchBerita();
      alert(editingId ? 'Berita updated successfully!' : 'Berita created successfully!');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`Error submitting form: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('content', item.content);
    setImageUrl(item.image || undefined);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this berita?')) {
      return;
    }

    try {
      await axios.delete(`/api/berita?id=${id}`);
      await fetchBerita();
      alert('Berita deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting berita:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`Error deleting berita: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editingId ? 'Edit Berita' : 'Add Berita'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        <Input {...register('title')} placeholder="Title" />
        <Textarea {...register('content')} placeholder="Content" rows={5} />
        <CustomUploadButton 
          onUploadComplete={(url) => setImageUrl(url)}
          value={imageUrl}
        />
        <div className="flex space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : editingId ? 'Update' : 'Add'} Berita
          </Button>
          {editingId && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setEditingId(null);
                setImageUrl(undefined);
              }}
              disabled={isSubmitting}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Content</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {berita.map((item: any) => (
            <tr key={item.id}>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.content.substring(0, 50)}...</td>
              <td className="border p-2">
                {item.image && item.image !== "" ? (
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.image}
                      alt="Berita"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div>No image available</div>
                )}
              </td>
              <td className="border p-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleEdit(item)} 
                  className="mr-2"
                  disabled={isSubmitting}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(item.id)}
                  disabled={isSubmitting}
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