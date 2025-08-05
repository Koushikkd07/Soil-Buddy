# AI Chatbot Integration Documentation

## Overview
This document describes the integration of real AI-powered chatbots into the SoilBuddy application, replacing the previous mock responses with intelligent, contextual conversations powered by Google Gemini AI.

## API Configuration

### Environment Variables
The following environment variables are configured in `.env.local`:

```env
VITE_GEMINI_API_KEY=AIzaSyAAMJfRxXCHEE9a0I3QuWDwetoDPkWng5g
VITE_GEMINI_MODEL=gemini-2.0-flash-exp
VITE_SITE_URL=http://localhost:8082
VITE_SITE_NAME=SoilBuddy Garden Assistant
```

### API Details
- **Provider**: Google Gemini AI
- **Model**: `gemini-2.0-flash-exp` (latest experimental model)
- **SDK**: `@google/generative-ai`
- **Authentication**: API Key based

## Implementation Architecture

### Core Service (`src/services/chatService.ts`)
The chat service provides a centralized Gemini AI interface with the following features:

#### Rate Limiting
- **Window**: 60 seconds
- **Max Requests**: 10 per window
- **Purpose**: Prevent API abuse and manage costs

#### Conversation Management
- Maintains conversation history (last 6 messages)
- Supports both child and elder user types
- Provides context-aware responses

#### Error Handling
- Graceful fallback to mock responses
- Comprehensive error logging
- User-friendly error messages

#### Safety Features
- Age-appropriate content filtering
- Gardening-focused conversation steering
- Professional vs. child-friendly tone adaptation

### System Prompts

#### Child Chatbot (Soily the Worm 🪱)
```
You are Soily the Worm 🪱, a friendly and enthusiastic garden helper who talks to children aged 6-12.

Your personality:
- Use simple, fun language that kids can understand
- Be encouraging and positive
- Use emojis and exclamation points
- Explain things like you're talking to a curious friend
- Make gardening sound exciting and magical
- Use analogies kids can relate to (like comparing roots to straws)

Current soil conditions: [Real-time data integration]

Always relate your advice to their actual soil conditions when relevant. Keep responses short (2-3 sentences max) and age-appropriate.
```

#### Elder Chatbot (Garden Assistant)
```
You are a professional Garden Assistant providing expert advice to adult gardeners and elderly users.

Your personality:
- Professional but friendly tone
- Provide detailed, accurate information
- Use proper gardening terminology
- Give practical, actionable advice
- Be patient and thorough in explanations
- Consider accessibility needs for elderly users

Current soil conditions: [Real-time data integration]

Always incorporate their actual soil data into your responses when relevant. Provide specific recommendations based on their current conditions.
```

## Component Integration

### ChildChatbot Component
**Location**: `src/components/ChildChatbot.tsx`

**Key Features**:
- Real-time AI responses with Soily the Worm personality
- Loading indicators with spinning animation
- Conversation history management
- Fallback responses for API failures
- Child-friendly error messages

**UI Enhancements**:
- Animated mascot (🪱) with wiggle effects
- Colorful gradient backgrounds
- Loading spinner during AI processing
- Bounce animations for engagement

### ElderChatbot Component
**Location**: `src/components/ElderChatbot.tsx`

**Key Features**:
- Professional AI responses with expert gardening advice
- Text-to-speech integration (when enabled)
- Detailed soil analysis and recommendations
- Accessibility-focused design
- Professional error handling

**UI Enhancements**:
- Clean, high-contrast design
- Loading indicators with professional styling
- Bot icon with spinning animation
- Large, readable text

## Real-time Soil Data Integration

Both chatbots receive real-time soil data including:
- **Moisture Level**: Current percentage and recommendations
- **pH Level**: Soil acidity/alkalinity with adjustment advice
- **Temperature**: Current soil temperature with seasonal guidance
- **Nutrients**: Nutrient levels with fertilization recommendations

### Data Flow
1. User sends message
2. Current soil data is included in API request
3. AI generates contextual response based on actual conditions
4. Response includes specific advice for current soil state

## Safety and Content Filtering

### Age-Appropriate Responses
- **Child Mode**: Simple language, encouraging tone, fun analogies
- **Elder Mode**: Professional terminology, detailed explanations, practical advice

### Topic Steering
- Automatically redirects non-gardening questions back to garden topics
- Maintains focus on soil care, plant health, and gardening practices
- Provides educational content appropriate for user age group

### Error Handling
- API failures gracefully fall back to contextual mock responses
- Rate limiting prevents API abuse
- Clear error messages for connectivity issues

## Testing and Debugging

### API Connection Test
A test button is available in the ChildDashboard header to verify API connectivity:

```typescript
const handleTestAPI = async () => {
  const isConnected = await testApiConnection();
  alert(isConnected ? 'API connection successful!' : 'API connection failed. Using fallback responses.');
};
```

### Debug Information
The service logs detailed information for troubleshooting:
- API key presence verification
- Request/response logging
- Error details and stack traces
- Rate limiting status

### Fallback Responses
When the API is unavailable, the system provides intelligent fallback responses based on:
- Current soil data analysis
- User message content analysis
- Age-appropriate language and tone
- Contextual gardening advice

## Performance Considerations

### Response Time Optimization
- Maximum token limits: 150 (child), 300 (elder)
- Temperature settings: 0.8 (child), 0.7 (elder)
- Conversation history limited to last 6 messages

### Cost Management
- Rate limiting prevents excessive API usage
- Efficient token usage with concise prompts
- Fallback responses reduce API dependency

### User Experience
- Loading indicators provide immediate feedback
- Conversation history maintains context
- Error states are handled gracefully
- Responses are optimized for readability

## Future Enhancements

### Planned Features
1. **Conversation Persistence**: Save chat history across sessions
2. **Advanced Soil Analysis**: Integration with more detailed sensor data
3. **Seasonal Recommendations**: Time-based gardening advice
4. **Plant-Specific Guidance**: Customized advice for different plant types
5. **Image Analysis**: AI-powered plant health assessment from photos

### Scalability Considerations
- Database integration for conversation storage
- User preference management
- Multi-language support expansion
- Advanced analytics and insights

## Troubleshooting

### Common Issues
1. **API Key Issues**: Verify VITE_GEMINI_API_KEY is set correctly in .env.local
2. **Rate Limiting**: Check console for rate limit warnings (10 requests per minute)
3. **Network Connectivity**: Test Gemini API connection using the debug button
4. **Model Availability**: Verify `gemini-2.0-flash-exp` model is available and accessible
5. **Quota Limits**: Check if Google AI Studio quota has been exceeded

### Debug Steps
1. Check browser console for error messages
2. Use the "Test AI" button to verify Gemini API connectivity
3. Verify environment variables in browser dev tools (VITE_GEMINI_API_KEY should be present)
4. Check network tab for Gemini API request/response details
5. Verify the model name `gemini-2.0-flash-exp` is correct and available

## Security Notes

### API Key Management
- API key is stored in environment variables
- Never commit API keys to version control
- Use different keys for development/production environments

### Data Privacy
- Conversation data is not permanently stored
- Soil data is only used for contextual responses
- No personal information is transmitted to the AI service

### Rate Limiting
- Prevents abuse and manages costs
- Graceful degradation when limits are reached
- User-friendly messaging for rate limit scenarios
