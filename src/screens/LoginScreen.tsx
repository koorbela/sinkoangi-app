import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onGoBack: () => void;
  onLoginSuccess: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  backgroundLight: '#DBE4EE',
  white: '#FFFFFF',
};

const LOGIN_URL = 'https://staging.sinkoangi.hu/belepes/?app=1';

const CHECKOUT_KEYWORDS = ['kosar', 'cart', 'checkout', 'penztar'];

const LOGGED_IN_KEYWORDS = ['/tagoknak/', '/profil/', '/haladas/', '/kurzusok/'];

function isCheckoutUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return CHECKOUT_KEYWORDS.some(keyword => lowerUrl.includes(keyword));
}

function isLoggedInUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return LOGGED_IN_KEYWORDS.some(keyword => lowerUrl.includes(keyword));
}

export function LoginScreen({ onGoBack, onLoginSuccess }: LoginScreenProps) {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(LOGIN_URL);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = async (navState: any) => {
    setCurrentUrl(navState.url);
    
    // Check if user has logged in (navigated to members area)
    if (!hasLoggedIn && isLoggedInUrl(navState.url)) {
      setHasLoggedIn(true);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      console.log('User logged in successfully');
      onLoginSuccess();
    }
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    if (isCheckoutUrl(request.url)) {
      Linking.openURL(request.url);
      return false;
    }
    return true;
  };

  const getTitle = () => {
    if (currentUrl.includes('/tagoknak/')) {
      return 'Tagoknak';
    }
    return 'Belépés';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{getTitle()}</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
          <Text style={styles.loadingText}>Oldal betöltése...</Text>
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ uri: LOGIN_URL }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />
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
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.primaryBlue,
  },
});
