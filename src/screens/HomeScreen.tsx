import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  accentRed: '#E3170A',
  backgroundLight: '#DBE4EE',
  accentYellow: '#FFDD4A',
  white: '#FFFFFF',
};

interface TileConfig {
  id: string;
  title: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  action: string;
}

const tiles: TileConfig[] = [
  {
    id: 'home',
    title: 'Főoldal',
    icon: '🏠',
    backgroundColor: COLORS.backgroundLight,
    textColor: COLORS.primaryBlue,
    action: 'homepage',
  },
  {
    id: 'services',
    title: 'Szolgáltatások',
    icon: '💎',
    backgroundColor: COLORS.backgroundLight,
    textColor: COLORS.primaryBlue,
    action: 'services',
  },
  {
    id: 'courses',
    title: 'Tanfolyamok',
    icon: '🎓',
    backgroundColor: COLORS.backgroundLight,
    textColor: COLORS.primaryBlue,
    action: 'courses',
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
    id: 'gift',
    title: 'Ajándék',
    icon: '🎁',
    backgroundColor: COLORS.accentYellow,
    textColor: COLORS.primaryBlue,
    action: 'gift',
  },
  {
    id: 'login',
    title: 'Belépés',
    icon: '🔐',
    backgroundColor: COLORS.secondaryGreen,
    textColor: COLORS.white,
    action: 'login',
  },
  {
    id: 'settings',
    title: 'Beállítások',
    icon: '⚙️',
    backgroundColor: '#9CA3AF',
    textColor: COLORS.white,
    action: 'settings',
  },
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const handleTilePress = (tile: TileConfig) => {
    if (tile.action === 'coming_soon') {
      Alert.alert('Hamarosan', 'Ez a funkció hamarosan elérhető lesz!');
    } else {
      onNavigate(tile.action);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Image
          source={require('../../assets/logokerek.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeTitle}>Üdvözöllek!</Text>
        <Text style={styles.welcomeSubtitle}>
          Az Egészség Konyhanyelven mobilalkalmazásában
        </Text>
      </View>

      <View style={styles.tilesContainer}>
        {tiles.map((tile) => (
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
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.secondaryGreen,
    textAlign: 'center',
    lineHeight: 22,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
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
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
