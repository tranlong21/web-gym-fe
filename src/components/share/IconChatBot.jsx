import React, { useState } from "react";
import ChatBot from "../ChatBot";
import { FaRobot, FaTimes } from "react-icons/fa"; // Import icon

const IconChatBot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen); // Đổi trạng thái mở/đóng popup
    };

    return (
        <>
            {/* Nút bật/tắt ChatBot */}
            <button
                onClick={toggleChat}
                className="text-foreground rounded-full flex items-center justify-center 
                            custom-bg fixed bottom-4 right-6 w-fit self-start z-50"
                aria-label="Chat Bot"
                name="Chat Bot"
            >
                <span className="relative peer w-14 h-14 p-4 hover:text-accent">
                    {isChatOpen ? (
                        <FaTimes size={24} className="text-white" /> // Hiển thị dấu "X" khi mở
                    ) : (
                        <FaRobot size={24} className="text-white" /> // Hiển thị icon ChatBot khi đóng
                    )}
                </span>
            </button>

            {/* Popup ChatBot */}
            {isChatOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center">
                    <div className="w-full max-w-md bg-white rounded-t-lg shadow-lg">
                        <ChatBot />
                    </div>
                </div>
            )}
        </>
    );
};

export default IconChatBot;