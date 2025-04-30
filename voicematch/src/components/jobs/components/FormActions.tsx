import React from "react";
import Button from "../../ui/Button";

interface FormActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export default function FormActions({
  onClose,
  isSubmitting,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-3">
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        disabled={isSubmitting}
        className="px-6"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="px-6"
      >
        {isSubmitting ? "Sending Invitation..." : "Send Job Invitation"}
      </Button>
    </div>
  );
}
