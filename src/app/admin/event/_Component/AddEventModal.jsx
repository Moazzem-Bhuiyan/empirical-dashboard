"use client";
import {
  Button,
  Form,
  Input,
  Modal,
  Upload,
  message,
  DatePicker,
  TimePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Image from "next/image";
import { useAddEventMutation } from "@/redux/api/eventApi";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddEventModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // add event api
  const [addEvent, { isLoading }] = useAddEventMutation();

  // Handle image upload
  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      const url = URL.createObjectURL(info.file.originFileObj);
      setImageUrl(url);
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed`);
    }
  };

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      description: description,
      date: values.date?.format("YYYY-MM-DD") || "",
      time: values.time?.format("HH:mm") || "",
      location: values.location || "",
    };
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      formData.append("image", values.image?.fileList?.[0]?.originFileObj);
      const res = await addEvent(formData).unwrap();
      if (res.success) {
        toast.success("Event added successfully!");
        setOpen(false);
        form.resetFields();
        setDescription("");
        setImageUrl("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add event");
    }
  };

  const uploadProps = {
    onRemove: () => {
      setImageUrl("");
    },
    beforeUpload: () => false,
    onChange: handleImageChange,
    maxCount: 1,
    accept: "image/*",
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setDescription("");
        setImageUrl("");
      }}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <p className="mt-1 text-gray-500">Fill in the details to publish</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          {/* Event Title */}
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Event Title
              </span>
            }
            name="title"
            rules={[
              { required: true, message: "Please enter the event title" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter a catchy title..."
              className="rounded-lg"
            />
          </Form.Item>

          {/* Date */}
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Event Date
              </span>
            }
            name="date"
            rules={[
              { required: true, message: "Please select the event date" },
            ]}
          >
            <DatePicker className="w-full rounded-lg" />
          </Form.Item>

          {/* Time */}
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Event Time
              </span>
            }
            name="time"
            rules={[
              { required: true, message: "Please select the event time" },
            ]}
          >
            <TimePicker className="w-full rounded-lg" format="HH:mm" />
          </Form.Item>

          {/* Location */}
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Location
              </span>
            }
            name="location"
            rules={[
              { required: true, message: "Please enter the event location" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter the event location..."
              className="rounded-lg"
            />
          </Form.Item>

          {/* Event Description */}
          <Form.Item label="Description:" name="description">
            <JoditEditor
              value={description}
              config={{ height: 400, placeholder: "Write event details..." }}
              onBlur={(content) => setDescription(content)}
            />
          </Form.Item>

          {/* Event Image */}
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Cover Image
              </span>
            }
            name="image"
            rules={[{ required: true, message: "Please upload a cover image" }]}
          >
            <Upload
              {...uploadProps}
              listType="picture-card"
              className="event-image-uploader"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="cover"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <UploadOutlined className="text-xl text-gray-400" />
                  <div className="mt-2 text-xs text-gray-500">
                    Click or drag image
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-0 mt-6 max-w-full">
            <div className="flex w-full justify-center">
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="!w-full"
              >
                Publish Event
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddEventModal;
