import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from './src/screens/HomeScreen';
import { BlogScreen } from './src/screens/BlogScreen';
import { PostDetailScreen } from './src/screens/PostDetailScreen';
import { PageDetailScreen } from './src/screens/PageDetailScreen';
import { SubMenuScreen } from './src/screens/SubMenuScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { WebViewScreen } from './src/screens/WebViewScreen';
// Push notifications disabled for Expo Go development
// import { usePushNotifications } from './src/utils/notifications';

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
  | 'page'
  | 'login'
  | 'settings'
  | 'account'
  | 'webview';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);
  const [selectedPage, setSelectedPage] = useState<{ slug: string; title: string } | null>(null);
  const [webViewData, setWebViewData] = useState<{ url: string; title: string } | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Push notifications disabled for Expo Go development
  // usePushNotifications();

  // Load login state on app start
  useEffect(() => {
    loadLoginState();
  }, []);

  const loadLoginState = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
    } catch (error) {
      console.error('Error loading login state:', error);
    }
  };

  const handleNavigate = (screen: string, params?: any) => {
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
    } else if (screen === 'login') {
      setCurrentScreen('login');
    } else if (screen === 'settings') {
      setCurrentScreen('settings');
    } else if (screen === 'account') {
      setCurrentScreen('account');
    } else if (screen === 'webview' && params?.url) {
      setWebViewData({ url: params.url, title: params.title || 'Oldal' });
      setPreviousScreen(currentScreen);
      setCurrentScreen('webview');
    }
  };

  const handleAccountNavigate = (screen: string, params?: any) => {
    if (screen === 'blog') {
      setPreviousScreen('account');
      setCurrentScreen('blog');
    } else if (screen === 'webview' && params?.url) {
      setWebViewData({ url: params.url, title: params.title || 'Oldal' });
      setPreviousScreen('account');
      setCurrentScreen('webview');
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen('account');
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setCurrentScreen('home');
  };

  const handleGoBack = () => {
    if (currentScreen === 'post') {
      setCurrentScreen('blog');
      setSelectedPost(null);
    } else if (currentScreen === 'page') {
      setCurrentScreen(previousScreen);
      setSelectedPage(null);
    } else if (currentScreen === 'webview') {
      setCurrentScreen(previousScreen);
      setWebViewData(null);
    } else if (currentScreen === 'blog' && previousScreen === 'account') {
      setCurrentScreen('account');
      setPreviousScreen('home');
    } else {
      setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      
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
      
      case 'login':
        return (
          <LoginScreen 
            onGoBack={handleGoBack} 
            onLoginSuccess={handleLoginSuccess}
          />
        );
      
      case 'settings':
        return <SettingsScreen onGoBack={handleGoBack} />;
      
      case 'account':
        return (
          <AccountScreen 
            onGoBack={handleGoBack}
            onNavigate={handleAccountNavigate}
            onLogout={handleLogout}
          />
        );
      
      case 'webview':
        return webViewData ? (
          <WebViewScreen
            url={webViewData.url}
            title={webViewData.title}
            onGoBack={handleGoBack}
          />
        ) : null;
      
      default:
        return <HomeScreen onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
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
