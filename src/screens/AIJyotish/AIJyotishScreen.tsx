import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { FreeAIService, AIResponse as FreeAIResponse } from '../../services/freeAIService';
import { OpenAIService, UserProfile as OpenAIUserProfile } from '../../services/openaiService';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile as AppUserProfile } from '../../types/firestore';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  providerLabel?: string;
}

const AIJyotishScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Namaste! I am your AI Jyotish guide. How can I help you with your spiritual and astrological questions today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = OpenAIService.getQuickPrompts();

  const profilePayload = (profile: AppUserProfile | null | undefined) => ({
    deityPreference: profile?.deityPreference,
    language: profile?.language,
    birthDate: profile?.birthDate,
    birthTime: profile?.birthTime,
    birthPlace: profile?.birthPlace,
  });

  const parseTimestamp = (timestamp?: string): Date => {
    if (!timestamp) {
      return new Date();
    }
    const parsed = new Date(timestamp);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const getProviderLabel = (provider: FreeAIResponse['provider']): string => {
    switch (provider) {
      case 'huggingface':
        return 'Powered by Hugging Face';
      case 'cohere':
        return 'Powered by Cohere';
      case 'anthropic':
        return 'Powered by Anthropic Claude';
      case 'mock':
      default:
        return 'AI Guidance (Offline Mode)';
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: trimmed,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    const aiProfile = profilePayload(userProfile);

    const tryOpenAiFallback = async (): Promise<{ text: string; timestamp: Date; providerLabel: string } | null> => {
      try {
        const openAiResponse = await OpenAIService.generateJyotishResponse(trimmed, aiProfile as OpenAIUserProfile);
        return {
          text: openAiResponse.content,
          timestamp: parseTimestamp(openAiResponse.timestamp),
          providerLabel: 'Powered by OpenAI',
        };
      } catch (fallbackError) {
        console.warn('OpenAI fallback failed:', fallbackError);
        return null;
      }
    };

    try {
      let response: FreeAIResponse | null = null;
      try {
        response = await FreeAIService.generateJyotishResponse(trimmed, aiProfile);
      } catch (freeError) {
        console.error('Free AI providers failed:', freeError);
      }

      let aiText = response?.content || '';
      let providerLabel = response ? getProviderLabel(response.provider) : 'AI Guidance';
      let aiTimestamp = response ? parseTimestamp(response.timestamp) : new Date();

      if (!response || response.provider === 'mock' || !aiText) {
        const fallback = await tryOpenAiFallback();
        if (fallback) {
          aiText = fallback.text;
          providerLabel = fallback.providerLabel;
          aiTimestamp = fallback.timestamp;
        }
      }

      if (!aiText) {
        aiText = 'I am unable to respond right now. Please try again in a moment.';
        providerLabel = 'System Message';
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: aiTimestamp,
        providerLabel,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      Alert.alert('Error', 'Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {!message.isUser && message.providerLabel && (
          <Text style={styles.providerLabel}>{message.providerLabel}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientLight, colors.background]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Jyotish</Text>
          <Text style={styles.subtitle}>Your personal astrologer</Text>
        </View>

        {/* Chat Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map(renderMessage)}
          {loading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts */}
        <View style={styles.quickPromptsContainer}>
          <Text style={styles.quickPromptsTitle}>Quick Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickPromptButton}
                onPress={() => handleQuickPrompt(prompt)}
                disabled={loading}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask your astrological question..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || loading}
          >
            <Ionicons name="send" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginVertical: 8,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    ...shadows.small,
  },
  providerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.cardBackground,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.secondary,
  },
  aiMessageText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  quickPromptsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quickPromptsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  quickPromptButton: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  quickPromptText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  sendButtonDisabled: {
    backgroundColor: colors.textLight,
  },
});

export default AIJyotishScreen;
