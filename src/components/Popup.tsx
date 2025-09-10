import { ReactNode } from "react";

interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
  actions?: ReactNode; // optional buttons
}

export default function Popup({ title, message, onClose, actions }: PopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>

        <div className="flex justify-center gap-3">
          {actions ? (
            actions
          ) : (
            <button
              onClick={onClose}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
