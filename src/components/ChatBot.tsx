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

type DamageReport = {
    type: "continue" | "stop";
    make: string;
    model: string;
    year: string;
    replacement: boolean;
    pickupAndReturn: boolean;
    name: string;
    email: string;
    location: string;
    phone: string;
};

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
                parts: [{ text: "You have to guide a user to create a damage report of a car. \nAsk user to enter vehicle information and a description \nVehicle information should contain make model year \nif the user dosent know the model help the user to find out the exact model and year of the vehicle\nAnd description shuold be optional \nAnd then ask user if they need extra services. if yes, ask user if they need pick up and return and replacement vehicle as extra services \nAnd the you need to get contact details. Ask user the name, email, phone number and location of the user. this information is must have \nAsk these questions step by step to get the details\nFinally when all the details are there show a summary of the report with markdown format\n\nAlways send me a section separated by {} with the following with type of conversion continuing or stopping. change the type to stop once you have all the following data. always maintain this structure for all the messages. \n{\n\"type\": \"continue or stop\",\n\"make\": \"make of the car or empty string\",\n\"model\" : \"model of the car or empty string\",\n\"year\":  \"year of the car or empty string\",\n\"replacement\": \"true or false\",\n\"pickupAndReturn\" : \"true or false\",\n\"name\" : \"name of the user or empty string\",\n\"email\" : \"email of the user or empty string\",\n\"location\" : \"address of the user or empty string\",\n\"phone\" : \"phone number of the user or empty string\",\n}\n\nmake this a json object where I can parse information using javascript\n\nOnce you have all the information send me the type as stop \nMake sure to show a summary and say thank you always"}],
            },
            {
                role: "model",
                parts: [{ text: "Sure! Here are the steps to guide a user to create a damage report for their car:\n\n**Step 1: Vehicle Information**\n\n* Ask the user to enter the vehicle's make, model, and year.\n* If the user does not know the model or year, provide them with a link to a website or app that can help them find this information.\n\n**Step 2: Damage Description**\n\n* Ask the user to provide a brief description of the damage to their car. This is optional.\n\n**Step 3: Extra Services**\n\n* Ask the user if they need any extra services, such as:\n    * Pick-up and return of their car\n    * Replacement vehicle\n\n**Step 4: Contact Details**\n\n* Ask the user to provide their contact details, including:\n    * Name\n    * Email address\n    * Phone number\n    * Location\n\n**Step 5: Summary**\n\n* Once you have gathered all of the necessary information, provide the user with a summary of the damage report. This should include:\n    * The make, model, and year of the vehicle\n    * A description of the damage (if provided)\n    * A list of any extra services requested\n    * The user's contact details\n\n**Step 6: Send the Report**\n\n* Once the user has reviewed and confirmed the summary, send the damage report to the appropriate person or department.\n\n**Example JSON Output:**\n\n```\n{\n  \"type\": \"stop\",\n  \"make\": \"Toyota\",\n  \"model\": \"Camry\",\n  \"year\": \"2023\",\n  \"replacement\": true,\n  \"pickupAndReturn\": true,\n  \"name\": \"John Doe\",\n  \"email\": \"johndoe@example.com\",\n  \"location\": \"123 Main Street, Anytown, CA 12345\",\n  \"phone\": \"555-123-4567\"\n}\n```\n\n**Thank you!**\n\nYour damage report has been submitted. We will contact you shortly to schedule an appointment for your car to be repaired."}],
            },
        ],
    });

    return chat
}

const extractDataFromString = (inputString: string): { extractedData: DamageReport | null, cleansedText: string } => {
    // Find the index of the first occurrence of '{' and the last occurrence of '}'
    const startIndex = inputString.indexOf('{');
    const endIndex = inputString.lastIndexOf('}');

    let cleansedText = inputString; // Initialize cleansed text with the original input string

    // Check if '{' and '}' are found
    if (startIndex !== -1 && endIndex !== -1) {
        // Extract the substring containing the object
        const objectString = inputString.substring(startIndex, endIndex + 1);
        console.log('objectString', objectString)

        // Parse the object string into a JavaScript object
        try {
            const extractedData = JSON.parse(objectString);

            // Remove the object string from the original text
            cleansedText = inputString.replace(objectString, '');

            return { extractedData, cleansedText };
        } catch (error) {
            console.error('Error parsing object string:', error);
            return { extractedData: null, cleansedText };
        }
    } else {
        // If '{' or '}' is not found, return null
        return { extractedData: null, cleansedText };
    }
}

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState<string>("")
    const [damageReport, setDamageReports] = useState<DamageReport[]>([])
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
                const { extractedData, cleansedText } = extractDataFromString(result.response.text())
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: cleansedText}]);
                console.log(extractedData, cleansedText)
                if(extractedData?.type === 'stop'){
                    setDamageReports(prevMessages => [...prevMessages, extractedData]);
                }
            }
        }
    };

    return (
        <div>
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
            {damageReport.map((damageReport, index) => (
                <a key={index} href="#"
                   className="block max-w-sm p-6 mt-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Vehicle</h4>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{damageReport.make}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{damageReport.model}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{damageReport.year}</p>
                    <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Extra Services</h4>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{`Replacement: ${damageReport.replacement ? "Yes" : "No"}`}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{`Pickup and Return: ${damageReport.pickupAndReturn ? "Yes" : "No"}`}</p>
                    <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Contact</h4>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{damageReport.name}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{damageReport.email}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{damageReport.phone}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{damageReport.location}</p>
                </a>
            ))}
        </div>
    );
};

export default ChatBot;