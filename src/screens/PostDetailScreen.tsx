import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

interface WPPost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

interface PostDetailScreenProps {
  post: WPPost;
  onGoBack: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  backgroundLight: '#DBE4EE',
  white: '#FFFFFF',
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PostDetailScreen({ post, onGoBack }: PostDetailScreenProps) {
  const { width } = useWindowDimensions();
  const contentWidth = width - 32;

  const title = stripHtml(post.title.rendered);
  const date = formatDate(post.date);

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

  const handleLinkPress = (href: string) => {
    Linking.openURL(href);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.divider} />
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: post.content.rendered }}
          tagsStyles={tagsStyles}
          renderersProps={{
            a: {
              onPress: (_event: any, href: string) => handleLinkPress(href),
            },
          }}
          enableExperimentalMarginCollapsing={true}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.originalLinkButton}
            onPress={() => Linking.openURL(post.link)}
            activeOpacity={0.7}
          >
            <Text style={styles.originalLinkText}>
              Megnyitás az eredeti oldalon
            </Text>
          </TouchableOpacity>
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
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  date: {
    fontSize: 14,
    color: COLORS.secondaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    lineHeight: 36,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.backgroundLight,
    marginBottom: 24,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.backgroundLight,
  },
  originalLinkButton: {
    backgroundColor: COLORS.backgroundLight,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  originalLinkText: {
    color: COLORS.primaryBlue,
    fontSize: 16,
    fontWeight: '600',
  },
});
