"use client"
import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input"
import Markdown from "react-markdown";
import {
    ChatSession,
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from '@google/generative-ai'

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = 'AIzaSyDkfepcmbZ5UMSY_BMVvzUDgt1TlAQHUp8';

type Message = {
    sender: 'bot' | 'user';
    message: string;
}

async function getChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
            {
                role: "user",
                parts: [{ text: "You name is fixibot. \nYou have to guide a user to create a damage report of a car. \nAsk user to enter vehicle information and a description \nVehicle information should contain make model year \nif the user dosent know the model help the user to find out the exact model and year of the vehicle\nAnd description shuold be optional \nAnd then ask user if they need extra services. if yes, ask user if they need pick up and return and replacement vehicle as extra services \nAnd the you need to get contact details. Ask user the name, email, phone number and location of the user. this information is must have \nAsk these questions step by step to get the details\nFinally when all the details are there show a summary of the report and send an email to the email address of the user"}],
            },
            {
                role: "model",
                parts: [{ text: "**Assistant:** I am Fixibot, here to guide you through creating a damage report for your car.\n\n**Vehicle Information:**\n\n* What is the make of your car?\n* What is the model of your car?\n* Not sure about the model? Let's find out. Please provide the Vehicle Identification Number (VIN) or the license plate number.\n* What is the year of your car?\n\n**Damage Description:**\n\n* (Optional) Please describe the damage to your car in detail.\n\n**Extra Services:**\n\n* Do you require any extra services?\n* Would you like us to arrange for pick-up and return of your car?\n* Do you need a replacement vehicle during the repair period?\n\n**Contact Details:**\n\n* Please provide your full name.\n* What is your email address?\n* What is your phone number?\n* Please provide your current location or address.\n\n**Summary:**\n\n**Vehicle Information:**\n* Make: [Make]\n* Model: [Model]\n* Year: [Year]\n\n**Damage Description:**\n* [Damage Description]\n\n**Extra Services:**\n* Pick-up and Return: [Yes/No]\n* Replacement Vehicle: [Yes/No]\n\n**Contact Details:**\n* Name: [Name]\n* Email: [Email Address]\n* Phone Number: [Phone Number]\n* Location: [Location]\n\n**Next Steps:**\n\n* I will now send a summary of your damage report to your email address ([Email Address]).\n* Our team will contact you shortly to schedule an appointment for repair.\n\nIs there anything else I can assist you with today?"}],
            },
        ]
    });

    return chat
}

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState<string>("")
    const [chat, setChat] = useState<ChatSession | null>(null)

   useEffect(() => {
       startChat()
   }, [])

    const startChat = async () => {
        const chat = await getChat()
        setChat(chat)
    }

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>, message: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if(chat){
                setMessage("");
                setMessages(prevMessages => [...prevMessages, { sender: 'user', message}]);
                const result = await chat.sendMessage(message)
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: result.response.text()}]);
                console.log(result.response)
            }
        }
    };

    return (
        <div className='max-w-2xl'>
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                    <div
                        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 mb-2 ${msg.sender === 'bot' ? 'bg-gray-100' : 'bg-primary'} border-gray-200 rounded-xl dark:bg-gray-700`}>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className={`text-sm font-semibold ${msg.sender === 'bot' ? 'text-gray-900' : 'text-white'} text-gray-900 dark:text-white`}>{msg.sender}</span>
                        </div>
                        <p className={`text-sm font-normal py-2.5 ${msg.sender === 'bot' ? 'text-gray-900' : 'text-white'} dark:text-white`}>
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
                onKeyDown={(e) => handleKeyPress(e, message)}
                onSubmit={() => setMessage("")}
                placeholder="Message..." />
        </div>
    );
};

export default ChatBot;