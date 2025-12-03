"use client";
import { useUpdateOrderMutation } from "@/redux/api/orderApi";
import { Modal, Button, Image } from "antd";
import { Mail, MapPin, Phone } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

export default function ProductsdetailsModal({ open, setOpen, selectedId }) {
  const [updateStatus, { isLoading }] = useUpdateOrderMutation();
  if (!selectedId) return null;
  const {
    items,
    billingDetails,
    amount,
    status,
    paymentStatus,
    createdAt,
    order_id,
    id,
  } = selectedId;

  const isCompleted = status === "delivered";

  // update order status handler

  const handleUpdateStatus = async () => {
    const payload = { id, status: "delivered" };
    try {
      const res = await updateStatus(payload).unwrap();
      if (res.success) {
        toast.success("Order status updated successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      width="70%"
    >
      <div className="rounded-md bg-gradient-to-tr from-[#F3F4F6] to-[#d7d4ad] p-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Order Details
          </h1>
          <p className="text-gray-700">
            Order ID: <span className="font-medium">{order_id}</span>
          </p>
          <p className="text-sm text-gray-600">
            Date: {moment(createdAt).format("ll")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT SIDE – Product List */}
          <div className="space-y-6 lg:col-span-2">
            {items?.map((item) => (
              <div
                key={item?._id}
                className="flex gap-5 rounded-xl bg-white p-5 shadow"
              >
                {/* Product Image */}
                <div className="w-40">
                  <Image
                    src={item?.product?.images[0]}
                    alt="product"
                    className="rounded-lg object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-gray-900">
                    {item?.product?.title}
                  </h2>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-lg">{item?.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-lg">{item?.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-lg capitalize">{status}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE – Customer & Payment Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="mb-5 text-xs font-semibold uppercase text-gray-500">
                Customer Information
              </p>

              <div className="space-y-5">
                {/* Name */}
                <div className="border-b pb-4">
                  <p className="text-xs uppercase text-gray-500">Full Name</p>
                  <p className="text-lg">{billingDetails?.name}</p>
                </div>

                {/* Email */}
                <div className="flex gap-3 border-b pb-4">
                  <Mail size={18} className="mt-1 text-gray-600" />
                  <div>
                    <p className="text-xs uppercase text-gray-500">Email</p>
                    <p className="break-all text-gray-800">
                      {billingDetails?.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3 border-b pb-4">
                  <Phone size={18} className="mt-1 text-gray-600" />
                  <div>
                    <p className="text-xs uppercase text-gray-500">Phone</p>
                    <p className="text-gray-800">
                      {billingDetails?.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-3">
                  <MapPin size={18} className="mt-1 text-gray-600" />
                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Shipping Address
                    </p>
                    <p className="leading-relaxed text-gray-800">
                      {billingDetails?.address}
                      <br />
                      {billingDetails?.city}, {billingDetails?.zipCode}
                      <br />
                      {billingDetails?.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="mb-4 text-xs font-semibold uppercase text-gray-500">
                Payment Summary
              </p>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold">${amount}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Payment Status</p>
                  <p className="font-medium capitalize">{paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Mark Completed Button */}
            <Button
              type="primary"
              style={{ width: "100%" }}
              disabled={isCompleted}
              onClick={handleUpdateStatus}
              loading={isLoading}
            >
              {isCompleted ? "Already Completed" : "Mark as Completed"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
