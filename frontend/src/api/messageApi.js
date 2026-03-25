import api from "./axios";

export const sendMessage = (data) => api.post("/messages", data);

export const getConversation = (otherUserId) =>
    api.get(`/messages/conversation/${otherUserId}`);

export const getInquiryChat = (inquiryId) =>
    api.get(`/messages/inquiry/${inquiryId}`);

export const getChatList = () => api.get("/messages/list");

export const deleteMessage = (id) => api.delete(`/messages/${id}`);

export const deleteConversation = (otherUserId) => api.delete(`/messages/conversation/${otherUserId}`);
