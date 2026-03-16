import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  url: string;
};

export default function WebScreen({ url }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
