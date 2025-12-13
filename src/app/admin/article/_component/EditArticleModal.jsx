"use client";

import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useUpdateArticleMutation } from "@/redux/api/articleApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditArticleModal = ({ open, setOpen, article }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState([]);

  const [updateArticle, { isLoading }] = useUpdateArticleMutation();

  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        title: article.title,
      });

      setDescription(article.description || "");
      setImageUrl(article.thumbnail || "");

      if (article.thumbnail) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: article.thumbnail,
          },
        ]);
      }
    }
  }, [article, form]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        title: values.title,
        description,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      const res = await updateArticle({
        id: article._id,
        data: formData,
      }).unwrap();

      if (res.success) {
        toast.success("Article updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update article");
    }
  };

  const uploadProps = {
    fileList,
    beforeUpload: () => false,
    maxCount: 1,
    accept: "image/*",
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
      onCancel={() => setOpen(false)}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Article</h2>
          <p className="mt-1 text-gray-500">Update your article content</p>
        </div>

        <Form form={form} layout="vertical" onFinish={onSubmit}>
          {/* Title */}
          <Form.Item
            label="Article Title"
            name="title"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>

          {/* Description */}
          <Form.Item label="Description">
            <JoditEditor
              value={description}
              onBlur={(content) => setDescription(content)}
              config={{
                height: 400,
                uploader: { insertImageAsBase64URI: true },
              }}
            />
          </Form.Item>

          {/* Image */}
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
                <div className="flex flex-col items-center">
                  <UploadOutlined />
                  <span className="text-xs">Upload</span>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Submit */}
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            className="!w-full"
          >
            Update Article
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default EditArticleModal;
