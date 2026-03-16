import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

type Props = {
  url: string;
};

export default function WebScreen({ url }: Props) {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
