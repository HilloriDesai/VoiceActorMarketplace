import React from "react";
import { Dialog } from "@headlessui/react";
import JobForm from "@/components/jobs/JobForm";

interface JobInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actorId: string;
  actorName: string;
}

export default function JobInviteModal({
  isOpen,
  onClose,
  onSuccess,
  actorId,
  actorName,
}: JobInviteModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-semibold mb-6 text-gray-900">
            Invite {actorName} to a Job
          </Dialog.Title>
          <JobForm actorId={actorId} onClose={onClose} onSuccess={onSuccess} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
