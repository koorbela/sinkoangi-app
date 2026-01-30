import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { BlogScreen } from './src/screens/BlogScreen';
import { PostDetailScreen } from './src/screens/PostDetailScreen';

interface WPPost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

type Screen = 'home' | 'blog' | 'post';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);

  const handleNavigateToBlog = () => {
    setCurrentScreen('blog');
  };

  const handleSelectPost = (post: WPPost) => {
    setSelectedPost(post);
    setCurrentScreen('post');
  };

  const handleGoBack = () => {
    if (currentScreen === 'post') {
      setCurrentScreen('blog');
      setSelectedPost(null);
    } else if (currentScreen === 'blog') {
      setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigateToBlog={handleNavigateToBlog} />;
      case 'blog':
        return <BlogScreen onSelectPost={handleSelectPost} onGoBack={handleGoBack} />;
      case 'post':
        return selectedPost ? (
          <PostDetailScreen post={selectedPost} onGoBack={handleGoBack} />
        ) : null;
      default:
        return <HomeScreen onNavigateToBlog={handleNavigateToBlog} />;
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
