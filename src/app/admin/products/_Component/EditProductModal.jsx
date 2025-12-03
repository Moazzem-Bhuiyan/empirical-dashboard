"use client";

import { RiCloseLargeLine } from "react-icons/ri";
import { useState } from "react";
import { Form, Input, Button, Upload, message, Modal, Divider } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const EditProductModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      description,
    };
    console.log("Form submitted:", formData);
    message.success("Product submitted successfully!");
    form.resetFields();
    setDescription("");
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      console.log("File selected:", file.name);
      message.success(`${file.name} selected successfully.`);
      return false;
    },
    onDrop(e) {
      const files = Array.from(e.dataTransfer.files);
      console.log(
        "Dropped files:",
        files.map((f) => f.name),
      );
      message.success(`${files.length} file(s) dropped successfully.`);
    },
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: "1100px",
        position: "relative",
      }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine
          size={18}
          color="black"
          className="absolute left-1/3 top-1/3"
        />
      </div>
      <h1 className="text-center text-2xl font-semibold">Edit Product</h1>
      <Divider />
      <div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ margin: "0 auto", padding: "0 16px" }}
        >
          <div className="flex justify-between gap-10">
            <div className="w-full">
              <Form.Item
                label="Product Title"
                name="productTitle"
                rules={[
                  { required: true, message: "Please enter product title" },
                ]}
              >
                <Input className="h-12" placeholder="JBG Black Stone" />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <Input className="h-12" placeholder="Enter" type="number" />
              </Form.Item>
              <Form.Item label="Discount (optional)" name="discount">
                <Input className="h-12" placeholder="Enter" type="number" />
              </Form.Item>

              <Form.Item label="Description">
                <Input.TextArea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  style={{ height: "200px", marginBottom: "50px" }}
                />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item label="Product Image">
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Drag & Drop your photo here</p>
                  <p className="ant-upload-hint">or Upload photo/s</p>
                  <Button style={{ marginTop: "10px" }}>Choose File</Button>
                </Dragger>
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: "40px", background: "#BE9955" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProductModal;
