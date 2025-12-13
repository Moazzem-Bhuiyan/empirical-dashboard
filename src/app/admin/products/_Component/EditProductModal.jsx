"use client";

import { RiCloseLargeLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Modal, Divider, Space } from "antd";
import { InboxOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useUpdateProductMutation } from "@/redux/api/productApi";

const { Dragger } = Upload;
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditProductModal = ({ open, setOpen, product }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  // 🔥 Set default values
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        title: product.product,
        price: product.price,
        discount: product.discountPrice || 0,
      });

      setDescription(product.description || "");
      setSizes(product.size || []);
      setImages(
        (product?.images || []).map((img, index) => ({
          uid: index,
          name: "image.png",
          status: "done",
          url: img,
        })),
      );
    }
  }, [product, form]);

  // Size handlers
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

  // Upload config
  const uploadProps = {
    multiple: true,
    beforeUpload: (file) => {
      file.uid = crypto.randomUUID();
      setImages((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setImages((prev) => prev.filter((img) => img.uid !== file.uid));
    },
    fileList: images,
  };

  // Submit update
  const handleSubmit = async (values) => {
    try {
      const payload = {
        title: values.title,
        description,
        price: Number(values.price),
        discount: Number(values.discount || 0),
        size: sizes,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      images.forEach((img) => {
        if (img.originFileObj) {
          formData.append("images", img.originFileObj);
        }
      });

      const res = await updateProduct({
        id: product._id,
        data: formData,
      }).unwrap();

      if (res.success) {
        toast.success("Product updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={1100}
      onCancel={() => setOpen(false)}
      closeIcon={false}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} />
      </div>

      <h1 className="text-center text-2xl font-semibold">Edit Product</h1>
      <Divider />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

            <Form.Item label="Product Images">
              <Dragger {...uploadProps}>
                <InboxOutlined />
                <p>Drag & Drop or Click</p>
              </Dragger>
            </Form.Item>

            <Form.Item label="Sizes & Quantity">
              {sizes.map((size, index) => (
                <Space key={index} className="mb-2">
                  <Input
                    value={size.type}
                    placeholder="Size"
                    onChange={(e) =>
                      handleSizeChange(index, "type", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    value={size.quantity}
                    placeholder="Qty"
                    onChange={(e) =>
                      handleSizeChange(index, "quantity", e.target.value)
                    }
                  />
                  <DeleteOutlined onClick={() => handleRemoveSize(index)} />
                </Space>
              ))}
              <Button
                block
                type="dashed"
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
                onBlur={(content) => setDescription(content)}
                config={{ height: 400 }}
              />
            </Form.Item>
          </div>
        </div>

        <Button
          htmlType="submit"
          loading={isLoading}
          type="primary"
          block
          style={{ background: "#BE9955" }}
        >
          Update Product
        </Button>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
