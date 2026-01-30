import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface SubMenuItem {
  id: string;
  title: string;
  icon: string;
  slug: string;
}

interface SubMenuScreenProps {
  title: string;
  items: SubMenuItem[];
  onSelectItem: (item: SubMenuItem) => void;
  onGoBack: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  backgroundLight: '#DBE4EE',
  accentYellow: '#FFDD4A',
  white: '#FFFFFF',
};

export function SubMenuScreen({ title, items, onSelectItem, onGoBack }: SubMenuScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tilesContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.tile}
              onPress={() => onSelectItem(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.tileIcon}>{item.icon}</Text>
              <Text style={styles.tileTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 32,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tileIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryBlue,
    textAlign: 'center',
  },
});
