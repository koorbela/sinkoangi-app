import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccountScreenProps {
  onGoBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  accentYellow: '#FFDD4A',
  backgroundLight: '#DBE4EE',
  white: '#FFFFFF',
  gray: '#6B7280',
};

interface TileConfig {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  action: 'page' | 'blog' | 'coming_soon' | 'logout' | 'health';
  url?: string;
  pageTitle?: string;
}

interface SectionConfig {
  title: string;
  tiles: TileConfig[];
}

const sections: SectionConfig[] = [
  {
    title: 'Saját tartalmak',
    tiles: [
      {
        id: 'health',
        title: 'Egészség Adataim',
        subtitle: 'Lépések, súly, víz, alvás',
        icon: '\u2764\uFE0F',
        backgroundColor: '#E3170A',
        textColor: COLORS.white,
        action: 'health',
      },
      {
        id: 'courses',
        title: 'Kurzusaim',
        subtitle: 'Saját hozzáférhető kurzusaim',
        icon: '📚',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/tagoknak/?app=1',
        pageTitle: 'Kurzusaim',
      },
      {
        id: 'progress',
        title: 'Haladásom',
        subtitle: 'Haladás áttekintés',
        icon: '📊',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/haladas/?app=1',
        pageTitle: 'Haladásom',
      },
      {
        id: 'profile',
        title: 'Profilom',
        subtitle: 'Profil szerkesztés',
        icon: '👤',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/profil/?app=1',
        pageTitle: 'Profilom',
      },
      {
        id: 'favorites',
        title: 'Kedvencek',
        subtitle: 'Mentett tartalmak',
        icon: '⭐',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'coming_soon',
      },
    ],
  },
  {
    title: 'Útmutatók',
    tiles: [
      {
        id: 'stress-guide',
        title: 'Stresszkezelés Útmutató',
        icon: '📗',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/stresszkezelesi-utmutato/?app=1',
        pageTitle: 'Stresszkezelés Útmutató',
      },
      {
        id: 'health-guide',
        title: 'Egészség Útmutató',
        icon: '📘',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/egeszseg-utmutato/?app=1',
        pageTitle: 'Egészség Útmutató',
      },
      {
        id: 'dictionary',
        title: 'Szótár',
        icon: '📖',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/szotar/?app=1',
        pageTitle: 'Szótár',
      },
      {
        id: 'recipes',
        title: 'Receptkönyv',
        icon: '🍳',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/receptkonyv/?app=1',
        pageTitle: 'Receptkönyv',
      },
    ],
  },
  {
    title: 'Tartós Fogyás Tanfolyam',
    tiles: [
      {
        id: 'weight-loss-videos',
        title: 'Tartós Fogyás Tanfolyam videók',
        icon: '🎬',
        backgroundColor: COLORS.accentYellow,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/kurzusok/tartos-fogyas-tanfolyam/?app=1',
        pageTitle: 'Tartós Fogyás Tanfolyam',
      },
      {
        id: 'bonuses',
        title: 'Bónuszok',
        icon: '🎁',
        backgroundColor: COLORS.accentYellow,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/tartos-fogyas-tanfolyam-bonuszok/?app=1',
        pageTitle: 'Bónuszok',
      },
    ],
  },
  {
    title: 'Egyéb',
    tiles: [
      {
        id: 'services',
        title: 'Szolgáltatások',
        icon: '💎',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/szolgaltatasok/?app=1',
        pageTitle: 'Szolgáltatások',
      },
      {
        id: 'available-courses',
        title: 'Megvásárolható tanfolyamok',
        icon: '🎓',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'page',
        url: 'https://staging.sinkoangi.hu/tanfolyamok/?app=1',
        pageTitle: 'Tanfolyamok',
      },
      {
        id: 'blog',
        title: 'Blog',
        icon: '📝',
        backgroundColor: COLORS.backgroundLight,
        textColor: COLORS.primaryBlue,
        action: 'blog',
      },
      {
        id: 'logout',
        title: 'Kijelentkezés',
        icon: '🚪',
        backgroundColor: '#EF4444',
        textColor: COLORS.white,
        action: 'logout',
      },
    ],
  },
];

export function AccountScreen({ onGoBack, onNavigate, onLogout }: AccountScreenProps) {
  const handleTilePress = (tile: TileConfig) => {
    switch (tile.action) {
      case 'page':
        if (tile.url) {
          onNavigate('webview', { url: tile.url, title: tile.pageTitle || tile.title });
        }
        break;
      case 'blog':
        onNavigate('blog');
        break;
      case 'coming_soon':
        Alert.alert('Hamarosan', 'Ez a funkció hamarosan elérhető lesz!');
        break;
      case 'health':
        onNavigate('health');
        break;
      case 'logout':
        Alert.alert(
          'Kijelentkezés',
          'Biztosan ki szeretnél jelentkezni?',
          [
            { text: 'Mégsem', style: 'cancel' },
            { 
              text: 'Kijelentkezés', 
              style: 'destructive',
              onPress: async () => {
                await AsyncStorage.removeItem('isLoggedIn');
                onLogout();
              }
            },
          ]
        );
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fiókom</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.tilesContainer}>
              {section.tiles.map((tile) => (
                <TouchableOpacity
                  key={tile.id}
                  style={[styles.tile, { backgroundColor: tile.backgroundColor }]}
                  onPress={() => handleTilePress(tile)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tileIcon}>{tile.icon}</Text>
                  <Text style={[styles.tileTitle, { color: tile.textColor }]}>
                    {tile.title}
                  </Text>
                  {tile.subtitle && (
                    <Text style={styles.tileSubtitle}>{tile.subtitle}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 12,
    paddingLeft: 4,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tileIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tileSubtitle: {
    fontSize: 11,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 4,
  },
});
