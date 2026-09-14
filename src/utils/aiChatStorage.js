const STORAGE_KEY = "react-js-ai-chats";

/**
 * Deterministically generates a stable chat ID based on the roadmap hierarchy.
 * Never uses timestamps, random numbers, or UUIDs.
 */
export function generateChatId({ categoryId, sectionId, topicId, subtopicId }) {
  if (!categoryId || !sectionId || !topicId) {
    console.warn("Missing required roadmap identifiers for generateChatId", {
      categoryId,
      sectionId,
      topicId,
      subtopicId
    });
  }

  const cleanCat = String(categoryId || "").trim();
  const cleanSec = String(sectionId || "").trim();
  const cleanTop = String(topicId || "").trim();

  if (subtopicId) {
    const cleanSub = String(subtopicId).trim();
    return `${cleanCat}/${cleanSec}/${cleanTop}/${cleanSub}`;
  }

  return `${cleanCat}/${cleanSec}/${cleanTop}`;
}

/**
 * Safely parses the chats dictionary from localStorage.
 */
function getChatsMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.error("Failed to read AI chats from localStorage:", err);
    return {};
  }
}

/**
 * Safely writes the chats dictionary to localStorage, handling QuotaExceededError.
 */
function setChatsMap(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch (err) {
    console.error("Failed to save AI chats to localStorage:", err);
    if (err.name === "QuotaExceededError" || err.code === 22) {
      console.warn("Storage quota exceeded for AI chats.");
    }
    return false;
  }
}

/**
 * Retrieves all chats as an array sorted by lastActivity descending.
 */
export function getChats() {
  const map = getChatsMap();
  return Object.values(map).sort(
    (a, b) => (b.lastActivity || 0) - (a.lastActivity || 0)
  );
}

/**
 * Retrieves a single chat by its deterministic chatId.
 */
export function getChat(chatId) {
  if (!chatId) return null;
  const map = getChatsMap();
  return map[chatId] || null;
}

/**
 * Look up an existing chat by either its deterministic chatId or raw topic/subtopic identifiers.
 */
export function getChatByTopic({ categoryId, sectionId, topicId, subtopicId }) {
  const id = generateChatId({ categoryId, sectionId, topicId, subtopicId });
  return getChat(id);
}

/**
 * Creates or overwrites a chat record in storage.
 */
export function saveChat(chat) {
  if (!chat || !chat.chatId) return null;
  const map = getChatsMap();
  const now = Date.now();

  const existing = map[chat.chatId];
  const updated = {
    ...existing,
    ...chat,
    createdAt: existing?.createdAt || chat.createdAt || now,
    lastActivity: now,
    messages: Array.isArray(chat.messages)
      ? chat.messages
      : existing?.messages || []
  };

  map[chat.chatId] = updated;
  setChatsMap(map);
  return updated;
}

/**
 * Updates an existing chat with partial fields.
 */
export function updateChat(chatId, updates) {
  if (!chatId) return null;
  const map = getChatsMap();
  const existing = map[chatId];
  if (!existing) return null;

  const updated = {
    ...existing,
    ...updates,
    lastActivity: Date.now()
  };

  map[chatId] = updated;
  setChatsMap(map);
  return updated;
}

/**
 * Removes a chat from storage by chatId.
 */
export function deleteChat(chatId) {
  if (!chatId) return false;
  const map = getChatsMap();
  if (map[chatId]) {
    delete map[chatId];
    setChatsMap(map);
    return true;
  }
  return false;
}

/**
 * Appends a message to a chat's message list and updates lastActivity.
 */
export function addMessage(chatId, message) {
  if (!chatId || !message) return null;
  const map = getChatsMap();
  const existing = map[chatId];
  if (!existing) return null;

  const now = Date.now();
  const formattedMessage = {
    id: message.id || `msg-${now}-${Math.random().toString(36).slice(2, 7)}`,
    role: message.role || "user",
    type: message.type || "text",
    content: message.content,
    createdAt: message.createdAt || now
  };

  const updatedMessages = [...(existing.messages || []), formattedMessage];
  const updatedChat = {
    ...existing,
    messages: updatedMessages,
    lastActivity: now
  };

  map[chatId] = updatedChat;
  setChatsMap(map);
  return updatedChat;
}

/**
 * Touches a chat's lastActivity timestamp to move it to the top of history.
 */
export function touchChat(chatId) {
  if (!chatId) return null;
  const map = getChatsMap();
  const existing = map[chatId];
  if (!existing) return null;

  existing.lastActivity = Date.now();
  map[chatId] = existing;
  setChatsMap(map);
  return existing;
}
