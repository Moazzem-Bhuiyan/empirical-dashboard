"use client";

import React from "react";
import {
  useDeleteGallaryMutation,
  useGetAllGallaryQuery,
} from "@/redux/api/galleryApi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import toast from "react-hot-toast";

const GalleryContainer = () => {
  const { data, isLoading, refetch } = useGetAllGallaryQuery();
  const [deleteGallery] = useDeleteGallaryMutation();

  const handleDelete = async (id) => {
    try {
      const res = await deleteGallery(id).unwrap();
      if (res.success) {
        toast.success("Image deleted successfully!");
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete image");
    }
  };

  if (isLoading) {
    return <p className="py-10 text-center text-xl">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data?.data?.map((item) => (
        <div
          key={item?._id}
          className="relative overflow-hidden rounded-lg border bg-white shadow-md"
        >
          {/* Delete Button */}
          <CustomConfirm
            title="Are you sure?"
            description="You won't be able to revert this!"
            onConfirm={() => handleDelete(item?._id)} // FIXED HERE
          >
            <button className="absolute right-2 top-2 rounded-full bg-white p-2 shadow transition hover:bg-red-500 hover:text-white">
              <RiDeleteBin6Line size={18} />
            </button>
          </CustomConfirm>

          {/* Image */}
          <Image
            src={item?.image}
            alt="gallery"
            className="h-48 w-full object-cover"
            width={1000}
            height={1000}
          />

          {/* Date */}
          <div className="p-2 text-sm text-gray-500">
            {new Date(item?.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryContainer;
