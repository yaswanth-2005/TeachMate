"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ThreadList } from "@/components/thread-list";
import { Thread } from "@/components/thread";
import { TooltipProvider } from "@/components/ui/tooltip";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <div className="h-screen w-screen bg-muted text-black">
      <AssistantRuntimeProvider runtime={runtime}>
        <TooltipProvider>
          <div className="h-full grid grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <aside className="bg-white border-r border-gray-200 p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Conversations</h2>
              <ThreadList />
            </aside>

            {/* Chat Section */}
            <main className="flex flex-col max-h-200px overflow-y-auto bg-gray-50">
              {/* Scrollable Chat Thread */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="bg-white rounded-lg shadow-sm border p-4 h-full">
                  <Thread />
                </div>
              </div>

              {/* Fixed Bottom Input / Button */}
              <div className="p-4 border-t bg-white">
                <div className="flex justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/dashboard")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </TooltipProvider>
      </AssistantRuntimeProvider>
    </div>
  );
};

export default Page;
