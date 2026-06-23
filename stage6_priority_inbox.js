const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzdXRhcmltYW5pa2FudGhhLjIzLmNzbUBhbml0cy5lZHUuaW4iLCJleHAiOjE3ODIyMDAwNzIsImlhdCI6MTc4MjE5OTE3MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjZkNDgyYWFhLWZjODgtNDYyNi1hMDQ3LWU5Yzc3MzA1ZmZkNCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InN1dGFyaSBtYW5pa2FudGhhIiwic3ViIjoiOGNmNWM5MzQtNjJjNS00M2UyLWE5M2QtODliMzY0Y2IzODQ2In0sImVtYWlsIjoic3V0YXJpbWFuaWthbnRoYS4yMy5jc21AYW5pdHMuZWR1LmluIiwibmFtZSI6InN1dGFyaSBtYW5pa2FudGhhIiwicm9sbE5vIjoiYTIzMTI2NTUyMjYzIiwiYWNjZXNzQ29kZSI6Ik1UcXhhciIsImNsaWVudElEIjoiOGNmNWM5MzQtNjJjNS00M2UyLWE5M2QtODliMzY0Y2IzODQ2IiwiY2xpZW50U2VjcmV0IjoiWUt0U1RNZVdqQ0F1R3dTQSJ9.Ko0XfUMgJbXi0zIq3AuQpsZYEYAFOTfS_pp1R7VMDnE"; 
const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const PRIORITY_WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

async function fetchAndSortPriorityInbox(topN = 10) {
    try {
        console.log(`Fetching notifications from API...`);
        
        // 3. Fetch from the protected API
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        // Extract array depending on API shape (usually inside data.notifications or directly the array)
        const notifications = data.notifications || data;

        console.log(`Successfully fetched ${notifications.length} notifications.\n`);

        // 4. Sort the notifications based on Priority rules
        notifications.sort((a, b) => {
            const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
            const weightB = PRIORITY_WEIGHTS[b.Type] || 0;

            // Rule A: Sort by Weight (Descending)
            if (weightA !== weightB) {
                return weightB - weightA; 
            }

            // Rule B: If weights are equal, Sort by Recency (Descending / Newest First)
            const timeA = new Date(a.Timestamp).getTime();
            const timeB = new Date(b.Timestamp).getTime();
            return timeB - timeA;
        });

        // 5. Extract Top N (10)
        const priorityInbox = notifications.slice(0, topN);

        // 6. Display Output neatly for your screenshot
        console.log(`=================================================`);
        console.log(`             PRIORITY INBOX (TOP ${topN})            `);
        console.log(`=================================================`);
        
        priorityInbox.forEach((notif, index) => {
            console.log(`${(index + 1).toString().padStart(2, '0')}. [${notif.Type.toUpperCase()}]`);
            console.log(`    Message: ${notif.Message}`);
            console.log(`    Time:    ${notif.Timestamp}`);
            console.log(`-------------------------------------------------`);
        });

    } catch (error) {
        console.error("Failed to generate Priority Inbox:", error.message);
    }
}

// Execute the function
fetchAndSortPriorityInbox(10);