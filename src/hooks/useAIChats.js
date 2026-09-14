import { useState, useCallback, useEffect } from "react";
import * as storage from "../utils/aiChatStorage";

export function useAIChats() {
  const [chats, setChats] = useState(() => storage.getChats());

  const refreshChats = useCallback(() => {
    setChats(storage.getChats());
  }, []);

  // Listen to window storage events if multi-tab sync is relevant
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "react-js-ai-chats") {
        refreshChats();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshChats]);

  const getChat = useCallback((chatId) => {
    return storage.getChat(chatId);
  }, []);

  const getChatByTopic = useCallback((topicItem) => {
    return storage.getChatByTopic(topicItem);
  }, []);

  const saveChat = useCallback((chat) => {
    const saved = storage.saveChat(chat);
    setChats(storage.getChats());
    return saved;
  }, []);

  const updateChat = useCallback((chatId, updates) => {
    const updated = storage.updateChat(chatId, updates);
    setChats(storage.getChats());
    return updated;
  }, []);

  const deleteChat = useCallback((chatId) => {
    const success = storage.deleteChat(chatId);
    setChats(storage.getChats());
    return success;
  }, []);

  const addMessage = useCallback((chatId, message) => {
    const updated = storage.addMessage(chatId, message);
    setChats(storage.getChats());
    return updated;
  }, []);

  const touchChat = useCallback((chatId) => {
    const touched = storage.touchChat(chatId);
    setChats(storage.getChats());
    return touched;
  }, []);

  return {
    chats,
    refreshChats,
    getChat,
    getChatByTopic,
    saveChat,
    updateChat,
    deleteChat,
    addMessage,
    touchChat,
    generateChatId: storage.generateChatId
  };
}
