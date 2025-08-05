import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  Volume2,
  Settings,
  X,
  Bot,
  User,
  Loader2
} from "lucide-react";
import { sendChatMessage, type SoilData } from "@/services/chatService";

interface ElderChatbotProps {
  soilData: SoilData;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

const ElderChatbot = ({ soilData, audioEnabled, onToggleAudio }: ElderChatbotProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Good day! I'm your Garden Assistant. I've analyzed your current soil conditions and I'm here to provide expert guidance for your garden care. How may I assist you today?",
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

  const speakMessage = (text: string) => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await sendChatMessage({
        message: userMessage,
        soilData,
        userType: 'elder',
        conversationHistory
      });

      return response.message;
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback to simple response
      return "I'm currently experiencing connectivity issues, but I can provide guidance on soil moisture, pH levels, temperature management, and nutrient requirements. What specific aspect would you like to discuss?";
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
        sender: 'assistant' as const,
        text: aiResponseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, response]);

      // Update conversation history with AI response
      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponseText }]);

      // Speak the response if audio is enabled
      if (audioEnabled) {
        speakMessage(aiResponseText);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const fallbackResponse = {
        id: messages.length + 2,
        sender: 'assistant' as const,
        text: "I'm experiencing connectivity issues. Please try again in a moment. I can still provide guidance on soil care and garden management.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackResponse]);

      if (audioEnabled) {
        speakMessage(fallbackResponse.text);
      }
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
          variant="elder"
          size="xl"
          onClick={() => setIsOpen(true)}
          className="rounded-lg h-16 w-16 shadow-soft"
        >
          <div className="flex flex-col items-center">
            <Bot className="h-6 w-6" />
            <span className="text-xs mt-1">Assistant</span>
          </div>
        </Button>
        <Badge 
          variant="outline" 
          className="absolute -top-2 -left-2 bg-elder-primary text-white"
        >
          Available
        </Badge>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-96' : 'w-[28rem]'
    }`}>
      <Card className="shadow-soft border-2 border-elder-primary">
        <CardHeader className="bg-elder-primary text-white p-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6" />
              <div>
                <div className="text-lg font-bold">Garden Assistant</div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm opacity-90">Expert Garden Guidance</div>
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
                onClick={onToggleAudio}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title={audioEnabled ? "Disable Audio" : "Enable Audio"}
              >
                <Volume2 className={`h-4 w-4 ${audioEnabled ? 'text-white' : 'text-white/50'}`} />
              </Button>
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
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-elder-primary text-white'
                        : 'bg-muted border border-border'
                    }`}
                  >
                    {message.sender === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-elder-primary" />
                        <span className="text-sm font-semibold text-elder-primary">Garden Assistant</span>
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-semibold">You</span>
                      </div>
                    )}
                    <div className="text-base leading-relaxed">{message.text}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-elder-primary" />
                      <span className="text-sm font-semibold text-elder-primary">Garden Assistant</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin text-elder-primary" />
                      <span className="text-base">Analyzing your request...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-elder-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-elder-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-elder-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <Separator />
            
            {/* Input Area */}
            <div className="p-4">
              <div className="flex space-x-2 mb-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('elderDashboard.chatbot.placeholder')}
                  className="flex-1 text-base"
                />
                <Button
                  variant="elder"
                  size="lg"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  {t('elderDashboard.chatbot.helpText')}
                </div>
                <div className="flex items-center space-x-2">
                  {audioEnabled && (
                    <Badge variant="success" className="text-xs">
                      Audio On
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ElderChatbot;
