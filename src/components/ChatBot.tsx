"use client"
import React, {useState} from 'react';
import { Input } from "@/components/ui/input"
import Markdown from "react-markdown";

type Message = {
    sender: 'bot' | 'user';
    message: string;
}

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState<string>("")

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setMessages(prevMessages => [...prevMessages, { sender: 'user', message}]);
            setMessage("");
            const response = await callAPI(message)
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: response}]);
            console.log(response)
        }
    };

    const callAPI = async (prompt: string): Promise<string> => {
        const apiKey: string = 'AIzaSyDkfepcmbZ5UMSY_BMVvzUDgt1TlAQHUp8'; // Replace 'YOUR_API_KEY' with your actual API key
        const apiUrl: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{parts: [{text: prompt}]}],
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to call API');
            }

            const responseData = await response.json();
            return responseData.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error('Error calling API:', error);
            return "Error";
        }
    }

    return (
        <div className='max-w-2xl'>
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                    <div
                        className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 mb-2 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.sender}</span>
                        </div>
                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                            <Markdown>
                                {msg.message}
                            </Markdown>
                        </p>
                    </div>
                </div>
            ))}
            <Input
                className='mt-2'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                onSubmit={() => setMessage("")}
                placeholder="Message..." />
        </div>
    );
};

export default ChatBot;