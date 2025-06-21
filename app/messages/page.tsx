"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  return (
    <div className="text-center mt-5 text-blue-500 flex flex-col items-center justify-center">
      This feature is Under Construction.
      <div className="mt-5">
        <Button onClick={() => router.push("/dashboard")}>
          {" "}
          <ChevronLeft />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default page;
