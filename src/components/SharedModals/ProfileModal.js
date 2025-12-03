"use client";

import { Modal } from "antd";
import Image from "next/image";
import { Tag } from "antd";
import { useEffect, useState } from "react";

export default function ProfileModal({ open, setOpen, selectedUser }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(selectedUser);
  }, [selectedUser]);

  // Get the first letter of the name (uppercase)
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  const isValidUrl = (url) => {
    if (!url) return false;
    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/")
    );
  };
  // Determine if the image is valid
  const hasValidImage = isValidUrl(user?.userImg);
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-primary-blue py-4">
        {hasValidImage ? (
          <Image
            src={user?.userImg}
            alt="User avatar"
            width={40}
            height={40}
            className="aspect-square h-auto w-10 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5b400] text-lg font-medium text-white">
            {firstLetter}
          </div>
        )}
        <h4 className="text-3xl font-bold text-white">{user?.name}</h4>
      </div>

      <div className="grid grid-cols-1 gap-7 px-12 py-8 md:grid-cols-2">
        <div className="text-black">
          <h5 className="font-bold">Name</h5>
          <p className="font-dmSans text-base">{user?.name}</p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Email</h5>
          <p className="font-dmSans text-base">{user?.email}</p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Contact</h5>
          <p className="font-dmSans text-base">{user?.contact}</p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Account Type</h5>
          <p className="font-dmSans">
            <Tag color="cyan" className="!mt-1 !text-sm !font-semibold">
              User
            </Tag>
          </p>
        </div>
      </div>
    </Modal>
  );
}
