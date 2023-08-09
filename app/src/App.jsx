import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

function App() {

  const API_KEY ='123abc';

  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([{
    message: 'Hello , I am ChatGPT',
    sender: 'ChatGPT'
  }])

  const handleSend = async (message) => {

    const newMessage = {
      'message': message,
      'sender': 'Venkat V',
      'direction': 'outgoing'
    }

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);
    await processChatMessagesWithChatGPTTurbo(newMessages);
  }

  async function processChatMessagesWithChatGPTTurbo(chatMessages) {

    let apiMessage = chatMessages.map((messageObject) => {

      let role = '';

      if (messageObject.sender === 'ChatGPT') {
        role = 'assistant';
      } else {
        role = 'user';

      }
      return { 'role': role, 'content': messageObject.message }

    });

    const defaultMessage = {
      'role': 'system',
      'content': 'Explain what is chatGPT'
    }
    const apiMessageRequestBody = {
      'model': 'gpt-3.5-turbo',
      'messages': [defaultMessage, ...apiMessage]

    }

    await fetch('https://api.openai.com/v1/chat/completions', {
      'method': 'POST',
      'headers': {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(apiMessageRequestBody),
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data)
      setMessages([...chatMessages,
      {
        message: data.choices[0].message.content,
        sender: 'ChatGPT'
      }
      ])
    })
  }

  return (

    <div className='App'>

      <div style={{ position: 'relative', height: '800px', width: '600px' }}>

        <MainContainer>
          <ChatContainer>
            <MessageList typingIndicator={typing ? <TypingIndicator content='Chat Gpt is Typing' /> : null}>
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type Message Here' onSend={handleSend}></MessageInput>
          </ChatContainer>
        </MainContainer>
      </div>


    </div>

  )
}

export default App
