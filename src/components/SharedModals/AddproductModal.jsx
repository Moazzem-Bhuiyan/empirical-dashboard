"use client";

import { RiCloseLargeLine } from "react-icons/ri";
import { useState } from "react";
import { Form, Input, Button, Space, Upload, Modal, Divider } from "antd";
import { InboxOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useAddProductMutation } from "@/redux/api/productApi";
import toast from "react-hot-toast";

const { Dragger } = Upload;
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddproductModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([{ type: "m", quantity: 0 }]);

  const [addProduct, { isLoading }] = useAddProductMutation();

  // Add new size row
  const handleAddSize = () => {
    setSizes([...sizes, { type: "", quantity: 0 }]);
  };

  // Remove size row
  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Update size field
  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = field === "quantity" ? Number(value) : value;
    setSizes(updated);
  };

  // Upload component config
  const uploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      file.uid = crypto.randomUUID(); // Ensure unique uid
      setImages((prev) => [...prev, file]);
      return false; // prevent uploading
    },
    onRemove: (file) => {
      setImages((prev) => prev.filter((img) => img.uid !== file.uid));
    },
  };

  // Submit Product
  const handleSubmit = async (values) => {
    if (!images.length) {
      return toast.error("Please add at least one product image");
    }

    try {
      const productData = {
        title: values.title,
        description,
        price: Number(values.price),
        discount: Number(values.discount || 0),
        size: sizes.filter((s) => s.type && s.quantity > 0),
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));

      // FIX: Append each image separately
      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await addProduct(formData).unwrap();

      if (res.success) {
        toast.success("Product added successfully!");
        // Reset everything
        form.resetFields();
        setDescription("");
        setImages([]);
        setSizes([{ type: "m", quantity: 0 }]);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add product");
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen(false)}
      closeIcon={false}
      width={1100}
    >
      {/* Close Button */}
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

      <h1 className="text-center text-2xl font-semibold">Add Product</h1>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ margin: "0 auto", padding: "0 16px" }}
      >
        <div className="flex gap-10">
          {/* LEFT COLUMN */}
          <div className="flex-1">
            <Form.Item
              label="Product Title"
              name="title"
              rules={[
                { required: true, message: "Please enter product title" },
              ]}
            >
              <Input
                placeholder="Unisex Puffer Winter Jacket"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <Input type="number" placeholder="4500" className="h-12" />
            </Form.Item>

            <Form.Item label="Discount (optional)" name="discount">
              <Input type="number" placeholder="0" className="h-12" />
            </Form.Item>

            {/* Image Upload */}
            <Form.Item label="Product Images">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Drag & Drop your photos here</p>
                <p className="ant-upload-hint">or Click to upload</p>
              </Dragger>
            </Form.Item>

            {/* Sizes */}
            <Form.Item label="Sizes & Quantities">
              {sizes.map((size, index) => (
                <Space key={index} className="mb-2">
                  <Input
                    placeholder="Size (m, l, xl)"
                    value={size.type}
                    onChange={(e) =>
                      handleSizeChange(index, "type", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={size.quantity}
                    onChange={(e) =>
                      handleSizeChange(index, "quantity", e.target.value)
                    }
                  />
                  <DeleteOutlined
                    onClick={() => handleRemoveSize(index)}
                    style={{ color: "red" }}
                  />
                </Space>
              ))}

              <Button
                type="dashed"
                onClick={handleAddSize}
                block
                icon={<PlusOutlined />}
              >
                Add Size
              </Button>
            </Form.Item>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1">
            <Form.Item label="Description :" name="description">
              <JoditEditor
                value={description}
                config={{
                  height: 500,
                  placeholder: "Write your product details...",
                  uploader: {
                    insertImageAsBase64URI: true,
                  },
                }}
                onBlur={(content) => setDescription(content)}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", background: "#BE9955" }}
            loading={isLoading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddproductModal;
