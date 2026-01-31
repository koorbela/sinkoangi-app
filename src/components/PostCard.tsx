import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface WPPost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
}

interface PostCardProps {
  post: WPPost;
  onPress: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  backgroundLight: '#DBE4EE',
  white: '#FFFFFF',
};

function decodeHtmlEntities(text: string): string {
  // Decode numeric HTML entities (&#xE1; &#225; etc.)
  let decoded = text.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) => 
    String.fromCharCode(parseInt(dec, 10))
  );
  
  // Decode named HTML entities
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&hellip;': '...',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': ''',
    '&rsquo;': ''',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
  };
  
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }
  
  // Handle [&hellip;] pattern from WordPress
  decoded = decoded.replace(/\[…\]/g, '...');
  
  return decoded;
}

function stripHtml(html: string): string {
  // First decode HTML entities, then strip tags
  const decoded = decodeHtmlEntities(html);
  return decoded
    .replace(/<[^>]*>/g, '')
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

export function PostCard({ post, onPress }: PostCardProps) {
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);
  const date = formatDate(post.date);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.excerpt} numberOfLines={3}>
        {excerpt}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.readMore}>Tovább olvasom →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: COLORS.secondaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryBlue,
    marginBottom: 8,
    lineHeight: 24,
  },
  excerpt: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondaryGreen,
  },
});
