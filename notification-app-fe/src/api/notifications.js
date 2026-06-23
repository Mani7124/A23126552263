// src/api/notifications.js
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzdXRhcmltYW5pa2FudGhhLjIzLmNzbUBhbml0cy5lZHUuaW4iLCJleHAiOjE3ODIyMDA5NDYsImlhdCI6MTc4MjIwMDA0NiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImViY2RmZTYyLTEwYjEtNDBkZC1iYTk5LWE3MDgwMjQ2NjA3YyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InN1dGFyaSBtYW5pa2FudGhhIiwic3ViIjoiOGNmNWM5MzQtNjJjNS00M2UyLWE5M2QtODliMzY0Y2IzODQ2In0sImVtYWlsIjoic3V0YXJpbWFuaWthbnRoYS4yMy5jc21AYW5pdHMuZWR1LmluIiwibmFtZSI6InN1dGFyaSBtYW5pa2FudGhhIiwicm9sbE5vIjoiYTIzMTI2NTUyMjYzIiwiYWNjZXNzQ29kZSI6Ik1UcXhhciIsImNsaWVudElEIjoiOGNmNWM5MzQtNjJjNS00M2UyLWE5M2QtODliMzY0Y2IzODQ2IiwiY2xpZW50U2VjcmV0IjoiWUt0U1RNZVdqQ0F1R3dTQSJ9.fH3Ouksn82rG_ozdI6bx0byv6GbQOX6m1rnar3rgOE4"; // <--- PASTE YOUR FRESH TOKEN HERE

// We use relative paths now so the Vite proxy handles it and bypasses CORS!
const API_URL = "/evaluation-service/notifications";
const LOG_URL = "/evaluation-service/logs";

export const logEvent = async (stack, level, message) => {
  try {
    await fetch(LOG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        stack: String(stack).toLowerCase(),
        level: String(level).toLowerCase(),
        package: "frontend-app",
        message: String(message)
      })
    });
  } catch (error) {
    console.error("Logger error:", error.message);
  }
};

export const fetchAllNotifications = async (limit = 10, page = 1) => {
  const res = await fetch(`${API_URL}?limit=${limit}&page=${page}`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return await res.json();
};

export const fetchPriorityBatch = async () => {
  // The API strictly enforces a maximum limit of 10 items per request.
  // We will fetch 10 and apply our Priority Sorting algorithm to them!
  const res = await fetch(`${API_URL}?limit=10&page=1`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!res.ok) throw new Error("Failed to fetch priority notifications");
  return await res.json();
};