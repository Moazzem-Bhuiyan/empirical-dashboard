"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Pagination } from "antd";
import { Search, Upload, Trash2, Edit2, PlusCircle } from "lucide-react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import toast from "react-hot-toast";
import AddEventModal from "./AddEventModal";
import {
  useDeleteEventMutation,
  useGetEventsQuery,
} from "@/redux/api/eventApi";
import EditEventModal from "./EditEvent";

export default function AllEvent() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Server-side pagination: pass page and limit to API
  const {
    data: articlesData,
    isLoading,
    refetch,
  } = useGetEventsQuery({
    page: currentPage,
    limit: 6,
    search: searchText,
  });

  const [deleteArticle] = useDeleteEventMutation();

  const handleDelete = async (id) => {
    try {
      const res = await deleteArticle(id).unwrap();
      if (res.success) {
        toast.success("Event deleted successfully!");
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete Event");
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/editArticle?id=${id}`);
  };

  if (isLoading) {
    return <p className="py-10 text-center text-xl">Loading...</p>;
  }

  const articles = articlesData?.data || [];
  const meta = articlesData?.meta || {};

  return (
    <div className="!min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">All Event</h1>
        <p className="text-gray-600">Manage and publish your content</p>
      </div>

      {/* Search & Upload */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search articles by title..."
          prefix={<Search size={20} className="text-gray-400" />}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
            refetch();
          }}
          className="h-12 rounded-xl border-gray-300 text-base focus:border-black"
        />
        <Button
          onClick={() => setOpen(true)}
          type="primary"
          icon={<PlusCircle size={18} />}
          className="flex items-center"
          style={{ backgroundColor: "#BE9955", padding: "22px 20px" }}
        >
          Upload Event
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article._id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={article?.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                  {article.title}
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      setSelectedEvent(article);
                      setEditOpen(true);
                    }}
                    icon={<Edit2 size={16} />}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    Edit
                  </Button>

                  <CustomConfirm
                    title="Delete Event"
                    description="Are you sure you want to delete this event? This action cannot be undone."
                    onConfirm={() => handleDelete(article._id)}
                  >
                    <Button className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                      <Trash2 size={16} /> Delete
                    </Button>
                  </CustomConfirm>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 h-24 w-24 rounded-xl border-2 border-dashed bg-gray-200" />
            <p className="mb-1 text-xl font-medium text-gray-700">
              No event found
            </p>
            <p className="text-gray-500">
              {searchText
                ? "Try adjusting your search."
                : "Start by uploading your first article!"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            current={meta.page}
            total={meta.total}
            pageSize={meta.limit}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* Add Article Modal */}
      <AddEventModal open={open} setOpen={setOpen} />
      {/* Edit Article Modal */}
      <EditEventModal
        open={editOpen}
        setOpen={setEditOpen}
        event={selectedEvent}
      />
    </div>
  );
}
