"use client";

import { LogoSvg } from "@/assets/logos/LogoSvg";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { resetPassSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/images/logo.png";
import { Color } from "antd/es/color-picker";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

export default function SetPasswordForm() {
  // reset api endpoint

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const onSubmit = async (data) => {
    try {
      const res = await resetPassword(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Password reset successfully");
        localStorage.removeItem("forgetPasswordToken");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full rounded-md border bg-white px-6 py-8">
      <Link
        href="/login"
        className="flex-center-start mb-4 gap-x-2 font-medium hover:text-primary-blue/85"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 flex flex-col items-center justify-center space-y-2">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h4 className="text-3xl font-semibold">Set New Password</h4>
        <p className="text-center">Enter your new password login</p>
      </section>

      <FormWrapper onSubmit={onSubmit} resolver={zodResolver(resetPassSchema)}>
        <UInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
          labelStyles={{ fontWeight: "500" }}
        />

        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
          labelStyles={{ fontWeight: "500" }}
        />

        <Button
          type="primary"
          size="large"
          className="!h-10 w-full !font-semibold"
          style={{
            background: "#000000",
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
