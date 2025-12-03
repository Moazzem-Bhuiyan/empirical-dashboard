"use client";
import { Button, Divider, Form, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RiCloseLargeLine } from "react-icons/ri";
import { useAddGallaryMutation } from "@/redux/api/galleryApi";
import toast from "react-hot-toast";

const AddbannerModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();

  // Mutation
  const [addBanner, { isLoading }] = useAddGallaryMutation();

  // Submit handler
  const handleSubmit = async (values) => {
    try {
      const file = values.image?.[0]?.originFileObj;

      if (!file) {
        toast.error("Please select an image!");
        return;
      }

      const formData = new FormData();
      formData.append("images", file);

      const res = await addBanner(formData).unwrap();

      if (res.success) {
        toast.success("Image added successfully!");
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add image");
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: "max-content",
        position: "relative",
      }}
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

      <div className="pb-5">
        <h4 className="text-center text-2xl font-medium">Add Gallery Image</h4>
        <Divider />

        <div className="flex-1">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{
              maxWidth: 500,
              marginTop: "25px",
            }}
          >
            {/* Upload Image */}
            <Form.Item
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  required: true,
                  message: "Please upload a banner image",
                },
              ]}
              style={{
                textAlign: "center",
                border: "2px dashed #B87CAE",
                paddingBlock: "20px",
                borderRadius: "10px",
              }}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>

            {/* Submit button */}
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              loading={isLoading}
              style={{
                color: "white",
                marginTop: "20px",
              }}
            >
              Upload
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AddbannerModal;
