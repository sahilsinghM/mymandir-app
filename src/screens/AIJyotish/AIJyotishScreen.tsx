import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { getAIJyotishResponse, getAvailableModels, testModels, AIModel, PerformanceMetrics } from '../../services/aiService';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  model?: string;
  metrics?: PerformanceMetrics;
}

export const AIJyotishScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('deepseek');
  const [availableModels, setAvailableModels] = useState<Array<{ id: AIModel; name: string }>>([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [testingPerformance, setTestingPerformance] = useState(false);

  useEffect(() => {
    loadAvailableModels();
  }, []);

  const loadAvailableModels = () => {
    const models = getAvailableModels();
    setAvailableModels(models.map((m) => ({ id: m.id, name: m.name })));
    
    // Set default to first available premium model
    const premiumModel = models.find((m) => m.id !== 'free');
    if (premiumModel) {
      setSelectedModel(premiumModel.id);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { role: 'user', text: message };
    setMessages((prev) => [...prev, userMessage]);
    const userQuery = message;
    setMessage('');
    setLoading(true);

    try {
      const startTime = Date.now();
      const response = await getAIJyotishResponse(
        userQuery,
        messages.length > 0 ? JSON.stringify(messages.slice(-3)) : '',
        selectedModel
      );
      const responseTime = Date.now() - startTime;

      const assistantMessage: Message = {
        role: 'assistant',
        text: response.content,
        model: response.model,
        metrics: {
          model: response.model,
          responseTime: response.responseTime || responseTime,
          tokensUsed: response.usage?.total_tokens,
          timestamp: new Date(),
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        text: `Sorry, I encountered an error: ${error.message}. Please try again or switch to another model.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPerformance = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message to test');
      return;
    }

    setTestingPerformance(true);
    setShowModelSelector(false);

    try {
      const results = await testModels(
        message,
        'You are an AI Jyotish assistant. Provide concise astrological guidance.',
        ['deepseek', 'openai', 'free'].filter((m) =>
          availableModels.some((am) => am.id === m)
        ) as AIModel[]
      );

      // Show performance comparison
      let comparisonText = 'Performance Test Results:\n\n';
      Object.entries(results).forEach(([model, result]) => {
        if ('error' in result) {
          comparisonText += `${model.toUpperCase()}: Error - ${result.error}\n`;
        } else {
          comparisonText += `${result.model}: ${result.responseTime}ms`;
          if (result.usage?.total_tokens) {
            comparisonText += `, ${result.usage.total_tokens} tokens`;
          }
          comparisonText += '\n';
        }
      });

      Alert.alert('Performance Test', comparisonText);

      // Add test results to messages
      const testMessage: Message = {
        role: 'assistant',
        text: `Performance test completed. Check the alert for details.\n\n` +
          `Test Query: "${message}"\n\n` +
          `You can compare responses from different models.`,
      };
      setMessages((prev) => [...prev, testMessage]);
    } catch (error: any) {
      Alert.alert('Error', `Performance test failed: ${error.message}`);
    } finally {
      setTestingPerformance(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.modelSelectorContainer}>
        <ThemedText variant="caption" color="textSecondary" style={styles.modelLabel}>
          Model:
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelScroll}>
          {availableModels.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelChip,
                selectedModel === model.id && styles.modelChipActive,
              ]}
              onPress={() => setSelectedModel(model.id)}
            >
              <ThemedText
                variant="caption"
                weight={selectedModel === model.id ? 'semiBold' : 'normal'}
                color={selectedModel === model.id ? 'textInverse' : 'textSecondary'}
              >
                {model.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.testButton}
          onPress={handleTestPerformance}
          disabled={testingPerformance || !message.trim()}
        >
          <ThemedText variant="caption" color="primary" weight="semiBold">
            {testingPerformance ? 'Testing...' : 'Test'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText variant="h3" color="primary" style={styles.emptyTitle}>
              AI Jyotish
            </ThemedText>
            <ThemedText variant="body" color="textSecondary" style={styles.emptyText}>
              Ask me anything about your horoscope, planetary positions, or seek spiritual guidance.
            </ThemedText>
            <ThemedText variant="caption" color="textLight" style={styles.emptySubtext}>
              Select a model above to start. Use "Test" to compare performance across models.
            </ThemedText>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.message,
                msg.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <ThemedText
                variant="body"
                color={msg.role === 'user' ? 'textInverse' : 'text'}
              >
                {msg.text}
              </ThemedText>
              {msg.metrics && (
                <View style={styles.metricsContainer}>
                  <ThemedText variant="caption" color="textLight" style={styles.metricsText}>
                    {msg.model} • {msg.metrics.responseTime}ms
                    {msg.metrics.tokensUsed && ` • ${msg.metrics.tokensUsed} tokens`}
                  </ThemedText>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question..."
          placeholderTextColor={theme.colors.textLight}
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!loading}
        />
        <ThemedButton
          title="Send"
          variant="primary"
          size="md"
          onPress={handleSend}
          loading={loading}
          disabled={!message.trim() || loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  message: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: theme.colors.backgroundSecondary,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    gap: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    maxHeight: 100,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.md,
  },
  modelSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  modelLabel: {
    marginRight: theme.spacing.xs,
  },
  modelScroll: {
    flex: 1,
  },
  modelChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modelChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  testButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  metricsContainer: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metricsText: {
    fontStyle: 'italic',
  },
  emptySubtext: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
});

