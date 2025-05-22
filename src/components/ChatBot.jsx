import React, { useState, useEffect } from 'react';
import ChatService from '../services/ChatService';
import { marked } from 'marked'; 

const ChatBot = () => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            return JSON.parse(savedMessages);
        } else {
            const welcomeMessage = { sender: "bot", text: "Chào bạn! Tôi là HLV thể hình. Hãy hỏi tôi điều bạn quan tâm nhé!" };
            localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
            return [welcomeMessage];
        }
    });

    const [input, setInput] = useState("");

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Lưu tin nhắn vào localStorage
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

        // Xóa nội dung trong ô nhập ngay lập tức
        setInput("");

        try {
            const botResponse = await ChatService.sendMessage(input);

            // Chuyển đổi nội dung Markdown thành HTML
            const formattedResponse = marked(botResponse);

            const botMessage = { sender: "bot", text: formattedResponse };
            const newMessages = [...updatedMessages, botMessage];
            setMessages(newMessages);

            // Lưu tin nhắn vào localStorage
            localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        } catch (error) {
            const errorMessage = { sender: "bot", text: "Có lỗi xảy ra, vui lòng thử lại sau." };
            const newMessages = [...updatedMessages, errorMessage];
            setMessages(newMessages);

            // Lưu tin nhắn vào localStorage
            localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        }
    };

    // Hàm để tạo đoạn chat mới
    const handleNewChat = () => {
        const welcomeMessage = { sender: "bot", text: "Chào bạn! Tôi là HLV thể hình. Hãy hỏi tôi điều bạn quan tâm nhé!" };
        const newMessages = [welcomeMessage];

        setMessages(newMessages); 
        localStorage.setItem('chatMessages', JSON.stringify(newMessages)); 
    };


    return (
        <div className="fixed bottom-20 right-6 w-96 bg-white shadow-lg rounded-lg overflow-hidden z-50">
            <div className="bg-blue-500 text-white p-4 text-lg font-bold flex justify-between items-center">
                <span>Chat Bot</span>
                <button
                    onClick={handleNewChat}
                    className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                >
                    New
                </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                    >
                        <span
                            className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                            dangerouslySetInnerHTML={{ __html: msg.text }} 
                        ></span>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
                    className="w-full border rounded-lg p-2"
                    placeholder="Nhập tin nhắn..."
                    maxLength={500}
                />
                <button
                    onClick={handleSendMessage}
                    className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBot;