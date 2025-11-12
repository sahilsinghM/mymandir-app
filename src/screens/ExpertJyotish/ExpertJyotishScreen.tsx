import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import {
  ExpertJyotish,
  getAllExperts,
  searchExperts,
  getExpertsBySpecialization,
} from '../../services/expertJyotishService';

export const ExpertJyotishScreen: React.FC = () => {
  const [experts, setExperts] = useState<ExpertJyotish[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<ExpertJyotish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const specializations = [
    'Vedic Astrology',
    'Kundali Matching',
    'Career Guidance',
    'Medical Astrology',
    'Marriage Astrology',
    'Business Astrology',
    'Remedies',
    'Muhurat',
  ];

  useEffect(() => {
    loadExperts();
  }, []);

  useEffect(() => {
    filterExperts();
  }, [searchQuery, selectedSpecialization, experts]);

  const loadExperts = async () => {
    try {
      setLoading(true);
      const data = await getAllExperts();
      setExperts(data);
      setFilteredExperts(data);
    } catch (error) {
      console.error('Error loading experts:', error);
      Alert.alert('Error', 'Failed to load experts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterExperts = async () => {
    try {
      let filtered = experts;

      if (selectedSpecialization) {
        filtered = await getExpertsBySpecialization(selectedSpecialization);
      }

      if (searchQuery.trim()) {
        filtered = await searchExperts(searchQuery);
        if (selectedSpecialization) {
          // Combine filters
          filtered = filtered.filter((expert) =>
            expert.specialization.some(
              (spec) => spec.toLowerCase() === selectedSpecialization.toLowerCase()
            )
          );
        }
      }

      setFilteredExperts(filtered);
    } catch (error) {
      console.error('Error filtering experts:', error);
    }
  };

  const handleContact = (expert: ExpertJyotish, method: 'phone' | 'whatsapp' | 'email') => {
    const contact = expert.contactMethods[method];
    if (!contact) {
      Alert.alert('Not Available', `${method} contact not available for this expert.`);
      return;
    }

    switch (method) {
      case 'phone':
        Linking.openURL(`tel:${contact}`);
        break;
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${contact.replace(/[^0-9]/g, '')}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${contact}`);
        break;
    }
  };

  const renderExpert = ({ item }: { item: ExpertJyotish }) => (
    <ThemedCard style={styles.expertCard}>
      <View style={styles.expertHeader}>
        <View style={styles.expertInfo}>
          <ThemedText variant="h4" style={styles.expertName}>
            {item.name}
          </ThemedText>
          <View style={styles.ratingContainer}>
            <ThemedText variant="caption" color="primary">
              ⭐ {item.rating}
            </ThemedText>
            <ThemedText variant="caption" color="textSecondary" style={styles.experience}>
              • {item.experience} years
            </ThemedText>
          </View>
          {item.location && (
            <ThemedText variant="caption" color="textSecondary">
              📍 {item.location}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.specializationContainer}>
        {item.specialization.map((spec, index) => (
          <View key={index} style={styles.specializationTag}>
            <ThemedText variant="caption" color="primary">
              {spec}
            </ThemedText>
          </View>
        ))}
      </View>

      <ThemedText variant="body" color="textSecondary" style={styles.bio}>
        {item.bio}
      </ThemedText>

      <View style={styles.availabilityContainer}>
        <ThemedText variant="caption" color="textSecondary">
          Availability:
        </ThemedText>
        <ThemedText
          variant="caption"
          color={item.availability === 'online' ? 'success' : 'primary'}
          weight="semiBold"
          style={styles.availability}
        >
          {item.availability.charAt(0).toUpperCase() + item.availability.slice(1)}
        </ThemedText>
      </View>

      <View style={styles.feeContainer}>
        <ThemedText variant="h4" color="primary">
          ₹{item.consultationFee}
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary">
          per consultation
        </ThemedText>
      </View>

      <View style={styles.contactButtons}>
        {item.contactMethods.phone && (
          <ThemedButton
            title="Call"
            variant="outline"
            size="sm"
            onPress={() => handleContact(item, 'phone')}
            style={styles.contactButton}
          />
        )}
        {item.contactMethods.whatsapp && (
          <ThemedButton
            title="WhatsApp"
            variant="outline"
            size="sm"
            onPress={() => handleContact(item, 'whatsapp')}
            style={styles.contactButton}
          />
        )}
        {item.contactMethods.email && (
          <ThemedButton
            title="Email"
            variant="outline"
            size="sm"
            onPress={() => handleContact(item, 'email')}
            style={styles.contactButton}
          />
        )}
      </View>
    </ThemedCard>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText variant="body" color="textSecondary" style={styles.loadingText}>
          Loading experts...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search experts by name or specialization..."
          placeholderTextColor={theme.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Specialization Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedSpecialization === null && styles.filterChipActive,
          ]}
          onPress={() => setSelectedSpecialization(null)}
        >
          <ThemedText
            variant="caption"
            weight={selectedSpecialization === null ? 'semiBold' : 'normal'}
            color={selectedSpecialization === null ? 'textInverse' : 'textSecondary'}
          >
            All
          </ThemedText>
        </TouchableOpacity>
        {specializations.map((spec) => (
          <TouchableOpacity
            key={spec}
            style={[
              styles.filterChip,
              selectedSpecialization === spec && styles.filterChipActive,
            ]}
            onPress={() => setSelectedSpecialization(spec)}
          >
            <ThemedText
              variant="caption"
              weight={selectedSpecialization === spec ? 'semiBold' : 'normal'}
              color={selectedSpecialization === spec ? 'textInverse' : 'textSecondary'}
            >
              {spec}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Experts List */}
      {filteredExperts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText variant="body" color="textSecondary" style={styles.emptyText}>
            No experts found. Try a different search or filter.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredExperts}
          renderItem={renderExpert}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  expertCard: {
    marginBottom: theme.spacing.lg,
  },
  expertHeader: {
    marginBottom: theme.spacing.md,
  },
  expertInfo: {
    marginBottom: theme.spacing.xs,
  },
  expertName: {
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  experience: {
    marginLeft: theme.spacing.xs,
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  specializationTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primaryLight + '30',
    borderRadius: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  bio: {
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.sizes.body * theme.typography.lineHeights.relaxed,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  availability: {
    marginLeft: theme.spacing.xs,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.md,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  contactButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
  },
});

