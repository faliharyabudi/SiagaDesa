import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

// Ganti IP di bawah dengan IP lokal komputer Anda saat menjalankan di HP (contoh: 192.168.1.5)
// Atau biarkan 10.0.2.2 jika menggunakan Emulator Android
const API_URL = 'http://10.0.2.2:8000/analyze'; 

export default function App() {
  const [laporan, setLaporan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeReport = async () => {
    if (!laporan.trim()) {
      alert('Masukkan laporan terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ laporan }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Error: Pastikan Backend FastAPI berjalan. Jika menggunakan HP asli, pastikan ganti 10.0.2.2 di App.js dengan IP komputer Anda. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Aman') return '#10B981';
    if (status === 'Waspada') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>🛡️ SiagaDesa</Text>
            <Text style={styles.subtitle}>Deteksi Dini Bencana Mobile</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Kirim Laporan Situasi:</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Air sungai mulai naik..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              value={laporan}
              onChangeText={setLaporan}
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={analyzeReport}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Analisis Laporan</Text>
              )}
            </TouchableOpacity>
          </View>

          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Hasil Analisis AI</Text>
              
              <View style={styles.resultRow}>
                <View style={styles.resultBox}>
                  <Text style={styles.resultLabel}>TINGKAT STATUS</Text>
                  <Text style={[styles.resultValue, { color: getStatusColor(result.status) }]}>
                    {result.status}
                  </Text>
                </View>
                
                <View style={styles.resultBox}>
                  <Text style={styles.resultLabel}>JENIS BENCANA</Text>
                  <Text style={styles.resultValue}>{result.jenis_bencana}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark theme background
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderRadius: 12,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
