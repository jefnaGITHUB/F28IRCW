import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import sendIcon from '../../assets/send.png';

// Need to define types 
type ChatMessage = {
    username: string;
    message: string;
    timestamp: string;
};

export default function Chat() {
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [topic, setTopic] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const firstVisitRef = useRef(true);

    const sortMessages = (msgArray : ChatMessage[]) => {
        return msgArray.sort((a, b) =>
            new Date(`1970/01/01 ${a.timestamp}`).getTime() -
            new Date(`1970/01/01 ${b.timestamp}`).getTime()
        );
    };

    const sendMessage = (e ? : React.FormEvent) => {
        e?.preventDefault(); // This stops page refresh
        // If no message, ignore
        if (input.trim() === '') return;
        // Send message to server
        socketRef.current?.emit('message', { message: input });
        // Refresh user input
        setInput('');
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }   

    useEffect(() => {
        if(firstVisitRef.current || messages.length === 0){
            // only works on page load
            firstVisitRef.current = false;
            return;
        }
        else{
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages]);

    useEffect(() => {

        // backend-port
        const port = 8181;
        socketRef.current = io(`http://localhost:${port}`);

        socketRef.current.on('connect', () => {
            console.log("connected!")
            // Get username from server
            socketRef.current?.emit('requestUsername');
            socketRef.current?.emit('requestTopic');
        })

        socketRef.current.on('topicData', (topic) => {
            console.log(topic);
            // set the topic
            setTopic(topic);
        })

        socketRef.current.on('getUsername', (username) => {
            console.log(username);
            setUsername(username);
        })
        // Listen for 'messageData' event from server
        socketRef.current.on('messageData', (msgArray : ChatMessage[]) => {
            const sortedMessages = sortMessages(msgArray);
            setMessages(sortedMessages);
        });

        return () => {
            socketRef.current?.off('messageData');
        };
    }, []);

    return (
        <>
            <div className='text-white/90 font-semibold flex justify-center mt-10'>
                <h1 className='text-5xl my-auto mr-5'>Live chat with other users</h1>
            </div>
            <div className="w-full max-w-2xl mx-auto flex flex-col h-[60vh] bg-white rounded-xl shadow-md overflow-hidden mt-10 mb-10">
                {/* Chat Header */}
                <div className="px-4 py-2 bg-blue-950 text-white text-lg">
                    <span className="flex italic justify-items-start">Live Chat - Username: {username}</span>
                    <span className='flex italic justify-items-end'>Topic: {topic ? topic : 'Ariana Grande'}</span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.username === username ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-xl text-white shadow ${
                                    message.username === username ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                            >
                                <div className="text-sm font-semi-bold mb-1 bg-gray-200 rounded-md text-black text-center">{message.username === username ? "YOU" : message.username}</div>
                                <div className='break-words'>{message.message}</div>
                                <div className="text-xs text-right opacity-75">{message.timestamp}</div>
                            </div>
                        </div>
                    ))}

                    {/* Scroll anchor */}
                    <div ref={scrollRef} />
                </div>

                {/* Message Input */}
                <form
                    onSubmit={(e) => sendMessage(e)}
                    className="flex items-center gap-2 p-3 border-t-2 border-gray-200 bg-blue-950"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={handleInput}  
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-full border border-white focus:outline-none focus:border-none focus:ring-1 text-white"
                    />
                    <button
                        type="submit"
                        className="h-7.5 w-7.5"
                    >
                        <img className='cursor-pointer' src={sendIcon} alt="Send"/>
                    </button>
                </form>
            </div>
        </>
    )
};

