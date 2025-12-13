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

const AddProductModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState([]);
  const [sizes, setSizes] = useState([{ type: "m", quantity: 0 }]);

  const [addProduct, { isLoading }] = useAddProductMutation();

  /* -------------------- Size handlers -------------------- */
  const handleAddSize = () => {
    setSizes([...sizes, { type: "", quantity: 0 }]);
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = field === "quantity" ? Number(value) : value;
    setSizes(updated);
  };

  /* -------------------- Upload config (FIXED) -------------------- */
  const uploadProps = {
    multiple: true,
    fileList,
    beforeUpload: () => false, // stop auto upload
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (values) => {
    if (!fileList.length) {
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

      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });

      const res = await addProduct(formData).unwrap();

      if (res.success) {
        toast.success("Product added successfully!");
        form.resetFields();
        setDescription("");
        setFileList([]);
        setSizes([{ type: "m", quantity: 0 }]);
        setOpen(false);
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
      {/* Close */}
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} className="absolute left-1/3 top-1/3" />
      </div>

      <h1 className="text-center text-2xl font-semibold">Add Product</h1>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ padding: "0 16px" }}
      >
        <div className="flex gap-10">
          {/* LEFT */}
          <div className="flex-1">
            <Form.Item
              label="Product Title"
              name="title"
              rules={[{ required: true }]}
            >
              <Input className="h-12" />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <Input type="number" className="h-12" />
            </Form.Item>

            <Form.Item label="Discount" name="discount">
              <Input type="number" className="h-12" />
            </Form.Item>

            {/* Images */}
            <Form.Item label="Product Images">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Drag & Drop images here</p>
                <p className="ant-upload-hint">or click to upload</p>
              </Dragger>
            </Form.Item>

            {/* Sizes */}
            <Form.Item label="Sizes & Quantity">
              {sizes.map((size, index) => (
                <Space key={index} className="mb-2">
                  <Input
                    placeholder="Size"
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
                block
                icon={<PlusOutlined />}
                onClick={handleAddSize}
              >
                Add Size
              </Button>
            </Form.Item>
          </div>

          {/* RIGHT */}
          <div className="flex-1">
            <Form.Item label="Description">
              <JoditEditor
                value={description}
                config={{ height: 500 }}
                onBlur={(content) => setDescription(content)}
              />
            </Form.Item>
          </div>
        </div>

        <Button
          htmlType="submit"
          type="primary"
          loading={isLoading}
          style={{ width: "100%", background: "#BE9955" }}
        >
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
