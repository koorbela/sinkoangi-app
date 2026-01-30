import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { BlogScreen } from './src/screens/BlogScreen';
import { PostDetailScreen } from './src/screens/PostDetailScreen';
import { PageDetailScreen } from './src/screens/PageDetailScreen';
import { SubMenuScreen } from './src/screens/SubMenuScreen';

interface WPPost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

interface SubMenuItem {
  id: string;
  title: string;
  icon: string;
  slug: string;
}

// Submenu configurations
const giftItems: SubMenuItem[] = [
  { id: 'egeszseg', title: 'Egészség Útmutató', icon: '💚', slug: 'egeszseg-utmutato-ajandekba' },
  { id: 'stressz', title: 'Stresszkezelés Útmutató', icon: '🧘', slug: 'stresszkezeles' },
];

const servicesItems: SubMenuItem[] = [
  { id: 'matrix', title: 'ÉletmódMátrix', icon: '🔮', slug: 'eletmodmatrix' },
  { id: 'konzult', title: 'Konzultáció', icon: '💬', slug: 'konzultacio' },
  { id: 'etrend', title: 'Étrendtervezés', icon: '🥗', slug: 'etrendtervezes' },
];

const coursesItems: SubMenuItem[] = [
  { id: 'rakdossze', title: 'Így rakd össze az étrended!', icon: '📚', slug: 'rakdossze' },
];

type Screen = 
  | 'home' 
  | 'homepage' 
  | 'blog' 
  | 'post' 
  | 'gift' 
  | 'services' 
  | 'courses' 
  | 'page';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);
  const [selectedPage, setSelectedPage] = useState<{ slug: string; title: string } | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');

  const handleNavigate = (screen: string) => {
    if (screen === 'homepage') {
      setSelectedPage({ slug: 'home', title: 'Főoldal' });
      setCurrentScreen('page');
      setPreviousScreen('home');
    } else if (screen === 'blog') {
      setCurrentScreen('blog');
    } else if (screen === 'gift') {
      setCurrentScreen('gift');
    } else if (screen === 'services') {
      setCurrentScreen('services');
    } else if (screen === 'courses') {
      setCurrentScreen('courses');
    }
  };

  const handleSelectPost = (post: WPPost) => {
    setSelectedPost(post);
    setCurrentScreen('post');
  };

  const handleSelectSubMenuItem = (item: SubMenuItem, fromScreen: Screen) => {
    setSelectedPage({ slug: item.slug, title: item.title });
    setPreviousScreen(fromScreen);
    setCurrentScreen('page');
  };

  const handleGoBack = () => {
    if (currentScreen === 'post') {
      setCurrentScreen('blog');
      setSelectedPost(null);
    } else if (currentScreen === 'page') {
      setCurrentScreen(previousScreen);
      setSelectedPage(null);
    } else {
      setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      
      case 'blog':
        return <BlogScreen onSelectPost={handleSelectPost} onGoBack={handleGoBack} />;
      
      case 'post':
        return selectedPost ? (
          <PostDetailScreen post={selectedPost} onGoBack={handleGoBack} />
        ) : null;
      
      case 'gift':
        return (
          <SubMenuScreen
            title="Ajándék"
            items={giftItems}
            onSelectItem={(item) => handleSelectSubMenuItem(item, 'gift')}
            onGoBack={handleGoBack}
          />
        );
      
      case 'services':
        return (
          <SubMenuScreen
            title="Szolgáltatások"
            items={servicesItems}
            onSelectItem={(item) => handleSelectSubMenuItem(item, 'services')}
            onGoBack={handleGoBack}
          />
        );
      
      case 'courses':
        return (
          <SubMenuScreen
            title="Tanfolyamok"
            items={coursesItems}
            onSelectItem={(item) => handleSelectSubMenuItem(item, 'courses')}
            onGoBack={handleGoBack}
          />
        );
      
      case 'page':
        return selectedPage ? (
          <PageDetailScreen
            slug={selectedPage.slug}
            title={selectedPage.title}
            onGoBack={handleGoBack}
          />
        ) : null;
      
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
