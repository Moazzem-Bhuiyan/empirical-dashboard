"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  Upload,
  DatePicker,
  TimePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useUpdateEventMutation } from "@/redux/api/eventApi";
import moment from "moment";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditEventModal = ({ open, setOpen, event }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState([]);

  const [updateEvent, { isLoading }] = useUpdateEventMutation();

  useEffect(() => {
    if (event) {
      form.setFieldsValue({
        title: event.title,
        location: event.location,
        date: moment(event.date, "ll"),
        time: moment(event.time, "HH:mm"),
      });

      setDescription(event.description || "");
      setImageUrl(event.thumbnail || "");

      if (event.thumbnail) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: event.thumbnail,
          },
        ]);
      }
    }
  }, [event, form]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        title: values.title,
        description,
        location: values.location,
        date: values.date?.format("YYYY-MM-DD"),
        time: values.time?.format("HH:mm"),
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      const res = await updateEvent({
        id: event._id,
        data: formData,
      }).unwrap();

      if (res.success) {
        toast.success("Event updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update event");
    }
  };

  const uploadProps = {
    fileList,
    beforeUpload: () => false,
    maxCount: 1,
    onChange: ({ fileList }) => {
      setFileList(fileList);
      if (fileList[0]?.originFileObj) {
        setImageUrl(URL.createObjectURL(fileList[0].originFileObj));
      }
    },
    onRemove: () => {
      setImageUrl("");
      setFileList([]);
    },
  };

  return (
    <Modal
      open={open}
      footer={null}
      width={900}
      centered
      onCancel={() => setOpen(false)}
      destroyOnClose
    >
      <div className="p-6">
        <h2 className="mb-6 text-center text-2xl font-bold">Edit Event</h2>

        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Event Date"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Event Time"
            rules={[{ required: true }]}
          >
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Description">
            <JoditEditor
              value={description}
              onBlur={(c) => setDescription(c)}
              config={{ height: 350 }}
            />
          </Form.Item>

          <Form.Item label="Cover Image">
            <Upload {...uploadProps} listType="picture-card">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="cover"
                  width={104}
                  height={104}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div className="text-xs">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            className="!w-full"
          >
            Update Event
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default EditEventModal;
