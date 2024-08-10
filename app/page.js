'use client';

import { Box, Stack, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';

export default function Home({ toggleMode, mode }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (content) => {
    // Convert markdown-style bold (**text**) to HTML bold (<strong>text</strong>)
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert lines starting with '-' to bullet points
    content = content.replace(/^- (.*$)/gim, '<li>$1</li>');

    // Wrap the entire content in a <ul> if bullet points are present
    if (content.includes('<li>')) {
      content = `<ul>${content}</ul>`;
    }

    // Convert newlines to <br> for proper line breaks in HTML
    content = content.replace(/\n/g, '<br>');

    return content;
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setIsTyping(true);

    const newMessages = [
      ...messages,
      { role: 'user', content: message },
    ];

    setMessages(newMessages);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      // Add the assistant's formatted response to the conversation history
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: formatMessage(responseData.text) },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor={mode === 'light' ? 'white' : '#333'}
      color={mode === 'light' ? 'black' : 'white'}
      width="100vw"
      height="100vh"
      sx={{
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        border="1px solid"
        borderColor={mode === 'light' ? 'black' : 'white'}
        borderRadius={8}
        p={2}
        spacing={3}
        bgcolor={mode === 'light' ? 'white' : '#333'}
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        sx={{
          transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h2 style={{ color: mode === 'light' ? 'black' : 'white', transition: 'color 0.3s' }}>Headstarter Assistant</h2>
          <IconButton
            onClick={toggleMode}
            aria-label="Toggle light and dark mode"
            sx={{
              '&:focus': {
                outline: '2px solid',
                outlineColor: mode === 'light' ? '#1976d2' : '#42a5f5',
                outlineOffset: '2px',
              },
            }}
          >
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Stack>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
              className="message-bubble" 
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? mode === 'light' ? '#1976d2' : '#42a5f5'
                    : mode === 'light' ? '#dc004e' : '#f48fb1'
                }
                color="white"
                borderRadius={16}
                p={3}
                boxShadow="0px 2px 6px rgba(0, 0, 0, 0.1)"
                sx={{
                  color: mode === 'light' ? '#FFFFFF' : '#EEEEEE',
                }}
                dangerouslySetInnerHTML={{ __html: message.content }} // Render the formatted message
              />
            </Box>
          ))}
          {isTyping && (
            <Box display="flex" justifyContent="flex-start" p={2}>
              <CircularProgress size={24} color="inherit" />
              <Box ml={2} color={mode === 'light' ? 'black' : 'white'}>
                Assistant is typing...
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
            aria-label="Type your message here"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: mode === 'light' ? '#fff' : '#555',
                '& fieldset': {
                  borderColor: mode === 'light' ? '#ccc' : '#777',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'light' ? '#aaa' : '#999',
                },
                '&.Mui-focused fieldset': {
                  borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            aria-label="Send message"
            sx={{
              backgroundColor: mode === 'light' ? '#1976d2' : '#42a5f5',
              '&:hover': {
                backgroundColor: mode === 'light' ? '#1565c0' : '#1e88e5',
              },
              '&:focus': {
                outline: '2px solid',
                outlineColor: mode === 'light' ? '#1976d2' : '#42a5f5',
                outlineOffset: '2px',
              },
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
