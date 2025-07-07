import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface CustomerAccountWebViewProps {
  url: string;
}

const CustomerAccountWebView: React.FC<CustomerAccountWebViewProps> = ({ url }) => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={true}
      />
    </SafeAreaView>
  );
};

export default CustomerAccountWebView; 