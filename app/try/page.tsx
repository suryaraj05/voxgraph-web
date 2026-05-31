import type { Metadata } from "next";
import { VoiceTryFlow } from "@/components/voice/VoiceTryFlow";

export const metadata: Metadata = {
  title: "Try VoxGraph",
  description: "Live voice chat demo — talk to VoxGraph through your browser mic.",
};

export default function TryPage() {
  return <VoiceTryFlow />;
}
