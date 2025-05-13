import axios from 'axios';

const API_PREFIX = "http://localhost:8091/api/v1/";

const ChatService = {
  sendMessage: async (message) => {
    try {
      const response = await axios.post(`${API_PREFIX}chatbot`, { message });
      return response.data;
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      throw error;
    }
  },
};

export default ChatService;