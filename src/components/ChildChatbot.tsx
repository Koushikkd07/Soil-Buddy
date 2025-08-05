import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  Volume2,
  Sparkles,
  X,
  Loader2
} from "lucide-react";
import { sendChatMessage, type SoilData } from "@/services/chatService";

interface ChildChatbotProps {
  soilData: SoilData;
}

const ChildChatbot = ({ soilData }: ChildChatbotProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'soily',
      text: "Hi there, little gardener! I'm Soily the Worm! 🪱 I'm here to help you take care of your garden. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isAIConnected, setIsAIConnected] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test AI connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { testApiConnection } = await import('@/services/chatService');
        const connected = await testApiConnection();
        setIsAIConnected(connected);
      } catch (error) {
        console.error('Failed to test AI connection:', error);
        setIsAIConnected(false);
      }
    };

    testConnection();
  }, []);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await sendChatMessage({
        message: userMessage,
        soilData,
        userType: 'child',
        conversationHistory
      });

      return response.message;
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback to simple response
      return "Oops! I'm having trouble thinking right now! 🤔 But I'm still here to help with your garden! Try asking me about watering or soil! 🌱";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessageText = inputMessage.trim();
    const userMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      text: userMessageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Update conversation history
    setConversationHistory(prev => [...prev, { role: 'user', content: userMessageText }]);

    try {
      // Get AI response
      const aiResponseText = await generateAIResponse(userMessageText);

      const response = {
        id: messages.length + 2,
        sender: 'soily' as const,
        text: aiResponseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, response]);

      // Update conversation history with AI response
      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponseText }]);

      // Play sound effect
      playNotificationSound();
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const fallbackResponse = {
        id: messages.length + 2,
        sender: 'soily' as const,
        text: "Oops! I'm having a little trouble right now! 🤔 But I'm still here to help! Try asking me again! 🌱",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="child"
          size="xl"
          onClick={() => setIsOpen(true)}
          className="rounded-full h-16 w-16 shadow-glow animate-pulse-glow"
        >
          <div className="flex flex-col items-center">
            <div className="text-2xl animate-wiggle">🪱</div>
          </div>
        </Button>
        <Badge 
          variant="child" 
          className="absolute -top-2 -left-2 animate-bounce-gentle"
        >
          Ask Soily!
        </Badge>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <Card className="shadow-glow border-2 border-child-primary">
        <CardHeader className="bg-gradient-child text-white p-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl animate-wiggle">🪱</div>
              <div>
                <div className="text-lg font-bold">Soily the Worm</div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-child-secondary">Your Garden Helper</div>
                  {isAIConnected !== null && (
                    <div className={`w-2 h-2 rounded-full ${
                      isAIConnected ? 'bg-green-400' : 'bg-yellow-400'
                    }`} title={isAIConnected ? 'AI Connected' : 'Using Fallback Responses'} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-child-primary text-white'
                        : 'bg-child-primary/10 text-child-primary border border-child-primary/20'
                    }`}
                  >
                    {message.sender === 'soily' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🪱</span>
                        <span className="text-xs font-bold">Soily</span>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-line">{message.text}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-child-primary/10 text-child-primary border border-child-primary/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg animate-bounce">🪱</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs font-bold">Soily is thinking...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-child-primary/20">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('childDashboard.chatbot.placeholder')}
                  className="flex-1 border-child-primary/30 focus:border-child-primary"
                />
                <Button
                  variant="child"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-muted-foreground">
                  {t('childDashboard.chatbot.helpText')}
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Sound
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChildChatbot;
