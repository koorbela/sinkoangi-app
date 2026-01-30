import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

interface PageDetailScreenProps {
  slug: string;
  title: string;
  onGoBack: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  backgroundLight: '#DBE4EE',
  white: '#FFFFFF',
};

const API_BASE = 'https://sinkoangi.hu/wp-json/wp/v2/pages?slug=';

export function PageDetailScreen({ slug, title, onGoBack }: PageDetailScreenProps) {
  const { width } = useWindowDimensions();
  const contentWidth = width - 32;
  
  const [content, setContent] = useState<string>('');
  const [pageTitle, setPageTitle] = useState<string>(title);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}${slug}`);
      if (!response.ok) {
        throw new Error('Hiba az oldal betöltésekor');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setContent(data[0].content.rendered);
        if (data[0].title?.rendered) {
          setPageTitle(data[0].title.rendered.replace(/<[^>]*>/g, ''));
        }
      } else {
        throw new Error('Az oldal nem található');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba');
    } finally {
      setLoading(false);
    }
  };

  const tagsStyles = {
    body: {
      color: '#1f2937',
      fontSize: 16,
      lineHeight: 26,
    },
    p: {
      marginBottom: 16,
    },
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: COLORS.primaryBlue,
      marginBottom: 16,
      marginTop: 24,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: COLORS.primaryBlue,
      marginBottom: 12,
      marginTop: 20,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: COLORS.primaryBlue,
      marginBottom: 10,
      marginTop: 16,
    },
    a: {
      color: COLORS.secondaryGreen,
      textDecorationLine: 'underline' as const,
    },
    img: {
      borderRadius: 8,
      marginVertical: 16,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: COLORS.secondaryGreen,
      paddingLeft: 16,
      marginVertical: 16,
      fontStyle: 'italic' as const,
      color: '#4b5563',
    },
    ul: {
      marginBottom: 16,
    },
    ol: {
      marginBottom: 16,
    },
    li: {
      marginBottom: 8,
    },
    figure: {
      marginVertical: 16,
    },
    figcaption: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center' as const,
      marginTop: 8,
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>← Vissza</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{pageTitle}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
          <Text style={styles.loadingText}>Oldal betöltése...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>← Vissza</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{pageTitle}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPage}>
            <Text style={styles.retryButtonText}>Újrapróbálás</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{pageTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: content }}
          tagsStyles={tagsStyles}
          enableExperimentalMarginCollapsing={true}
        />
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.primaryBlue,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
