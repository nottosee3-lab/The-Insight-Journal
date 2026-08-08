// script.js
// Automatically converts core Markdown styles to native HTML elements
function parseMarkdown(text) {
    if (!text) return "";
    
    return text
        // 1. Convert double asterisks (**text**) into HTML bold tags
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        
        // 2. Convert standard markdown lists (* text) into list items
        .replace(/^\*\s(.*)$/gm, '<li>$1</li>')
        
        // 3. Collect adjacent list elements into a native ul wrapper
        .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>')
        
        // 4. Transform native line splits into functional line breaks
        .replace(/\n/g, '<br>');
}

async function sendMessage() {
    const userInputField = document.getElementById('userInput');
    const userInput = userInputField.value.trim();
    const chatbox = document.getElementById('chatbox');

    if (!userInput) return;

    // Render user's question locally
    chatbox.innerHTML += `<div class="user"><b>You:</b> ${userInput}</div>`;
    userInputField.value = '';
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
        // Calls your serverless proxy locally on your site instead of public Google URL
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userInput })
        });

        const data = await response.json();
        
        // Extract out the response text cleanly from Gemini JSON formatting
        const rawAiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        
        // Format markdown to HTML string
        const formattedAiText = parseMarkdown(rawAiText);
        
        // Render formatted answer in the window layout
        chatbox.innerHTML += `<div class="ai"><b>AI:</b> <div>${formattedAiText}</div></div>`;
    } catch (error) {
        chatbox.innerHTML += `<div style="color:red;" class="ai"><b>Error:</b> Could not fetch a response securely.</div>`;
    }
    
    chatbox.scrollTop = chatbox.scrollHeight;
}
