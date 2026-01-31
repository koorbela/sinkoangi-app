import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
  HealthInputOptions,
} from 'react-native-health';

interface HealthScreenProps {
  onGoBack: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  accentRed: '#E3170A',
  backgroundLight: '#DBE4EE',
  accentYellow: '#FFDD4A',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.Water,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.Water,
    ],
  },
};

export function HealthScreen({ onGoBack }: HealthScreenProps) {
  const [stepCount, setStepCount] = useState<number>(0);
  const [isHealthKitAvailable, setIsHealthKitAvailable] = useState<boolean | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [sleepHours, setSleepHours] = useState<string>('');
  
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [sleepInput, setSleepInput] = useState('');

  useEffect(() => {
    if (Platform.OS === 'ios') {
      initializeHealthKit();
    } else {
      setIsHealthKitAvailable(false);
    }
  }, []);

  const initializeHealthKit = () => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.log('HealthKit initialization error:', error);
        setIsHealthKitAvailable(false);
        return;
      }
      
      setIsHealthKitAvailable(true);
      loadHealthData();
    });
  };

  const loadHealthData = () => {
    loadSteps();
    loadWeight();
    loadWaterIntake();
    loadSleep();
  };

  const loadSteps = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const options: HealthInputOptions = {
      startDate: today.toISOString(),
      endDate: new Date().toISOString(),
    };

    AppleHealthKit.getStepCount(options, (error: string, results: HealthValue) => {
      if (error) {
        console.log('Error getting steps:', error);
        return;
      }
      if (results && results.value) {
        setStepCount(Math.round(results.value));
      }
    });
  };

  const loadWeight = () => {
    const options: HealthInputOptions = {
      unit: 'kg',
    };

    AppleHealthKit.getLatestWeight(options, (error: string, results: HealthValue) => {
      if (error) {
        console.log('Error getting weight:', error);
        return;
      }
      if (results && results.value) {
        setWeight(results.value.toFixed(1));
      }
    });
  };

  const loadWaterIntake = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const options: HealthInputOptions = {
      startDate: today.toISOString(),
      endDate: new Date().toISOString(),
      unit: 'liter',
    };

    AppleHealthKit.getWater(options, (error: string, results: Array<HealthValue>) => {
      if (error) {
        console.log('Error getting water:', error);
        return;
      }
      if (results && results.length > 0) {
        const totalWater = results.reduce((sum, entry) => sum + (entry.value || 0), 0);
        setWaterIntake(totalWater);
      }
    });
  };

  const loadSleep = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(18, 0, 0, 0);
    
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    
    const options: HealthInputOptions = {
      startDate: yesterday.toISOString(),
      endDate: today.toISOString(),
    };

    AppleHealthKit.getSleepSamples(options, (error: string, results: Array<any>) => {
      if (error) {
        console.log('Error getting sleep:', error);
        return;
      }
      if (results && results.length > 0) {
        let totalSleepMinutes = 0;
        results.forEach((sample) => {
          if (sample.value === 'ASLEEP' || sample.value === 'INBED') {
            const start = new Date(sample.startDate);
            const end = new Date(sample.endDate);
            const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
            totalSleepMinutes += durationMinutes;
          }
        });
        const hours = totalSleepMinutes / 60;
        setSleepHours(hours.toFixed(1));
      }
    });
  };

  const saveWeight = () => {
    if (!weightInput || isNaN(parseFloat(weightInput))) {
      Alert.alert('Hiba', 'Kérlek adj meg egy érvényes számot!');
      return;
    }
    
    const weightValue = parseFloat(weightInput);
    
    const options = {
      value: weightValue,
      unit: 'kg',
      startDate: new Date().toISOString(),
    };

    AppleHealthKit.saveWeight(options, (error: string, result: HealthValue) => {
      if (error) {
        console.log('Error saving weight:', error);
        Alert.alert('Hiba', 'Nem sikerült menteni a súlyt a HealthKit-be.');
        return;
      }
      setWeight(weightValue.toFixed(1));
      setShowWeightModal(false);
      setWeightInput('');
      Alert.alert('Siker', 'Súly rögzítve a HealthKit-be!');
    });
  };

  const addWater = () => {
    const options = {
      value: 0.25,
      unit: 'liter',
      startDate: new Date().toISOString(),
    };

    AppleHealthKit.saveWater(options, (error: string, result: HealthValue) => {
      if (error) {
        console.log('Error saving water:', error);
        Alert.alert('Hiba', 'Nem sikerült menteni a vízbevitelt a HealthKit-be.');
        return;
      }
      setWaterIntake((prev) => prev + 0.25);
    });
  };

  const saveSleep = () => {
    if (!sleepInput || isNaN(parseFloat(sleepInput))) {
      Alert.alert('Hiba', 'Kérlek adj meg egy érvényes számot!');
      return;
    }
    setSleepHours(sleepInput);
    setShowSleepModal(false);
    setSleepInput('');
    Alert.alert('Megjegyzés', 'Az alvás adatok csak olvashatók a HealthKit-ből. A manuális rögzítés helyben történik.');
  };

  const renderNotAvailable = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Egészség Adataim</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.notAvailableContainer}>
        <Text style={styles.notAvailableIcon}>🏥</Text>
        <Text style={styles.notAvailableTitle}>HealthKit nem elérhető</Text>
        <Text style={styles.notAvailableText}>
          Ez a funkció csak iOS eszközökön érhető el Apple HealthKit integrációval.
        </Text>
      </View>
    </View>
  );

  if (Platform.OS !== 'ios' || isHealthKitAvailable === false) {
    return renderNotAvailable();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Egészség Adataim</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>👣</Text>
            <Text style={styles.cardTitle}>Mai lépések</Text>
          </View>
          <Text style={styles.cardValue}>
            {stepCount.toLocaleString('hu-HU')}
          </Text>
          <Text style={styles.cardUnit}>lépés</Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.refreshButton]}
            onPress={loadSteps}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Frissítés</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚖️</Text>
            <Text style={styles.cardTitle}>Súly</Text>
          </View>
          <Text style={styles.cardValue}>
            {weight ? weight : '--'}
          </Text>
          <Text style={styles.cardUnit}>kg</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              setWeightInput(weight);
              setShowWeightModal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Súly rögzítése</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💧</Text>
            <Text style={styles.cardTitle}>Vízbevitel</Text>
          </View>
          <Text style={styles.cardValue}>{waterIntake.toFixed(2)}</Text>
          <Text style={styles.cardUnit}>liter ma</Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.waterButton]}
            onPress={addWater}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>+ 0.25 L</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>😴</Text>
            <Text style={styles.cardTitle}>Alvás</Text>
          </View>
          <Text style={styles.cardValue}>
            {sleepHours ? sleepHours : '--'}
          </Text>
          <Text style={styles.cardUnit}>óra tegnap éjjel</Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.refreshButton]}
            onPress={loadSleep}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Frissítés</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.healthKitNote}>
          <Text style={styles.healthKitNoteText}>
            ✅ Apple HealthKit integráció aktív - az adatok automatikusan szinkronizálódnak
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showWeightModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Súly rögzítése</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="pl. 75.5"
              keyboardType="decimal-pad"
              value={weightInput}
              onChangeText={setWeightInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowWeightModal(false)}
              >
                <Text style={styles.cancelButtonText}>Mégsem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveWeight}
              >
                <Text style={styles.saveButtonText}>Mentés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSleepModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSleepModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alvás rögzítése</Text>
            <Text style={styles.modalSubtitle}>Hány órát aludtál ma éjjel?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="pl. 7.5"
              keyboardType="decimal-pad"
              value={sleepInput}
              onChangeText={setSleepInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSleepModal(false)}
              >
                <Text style={styles.cancelButtonText}>Mégsem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveSleep}
              >
                <Text style={styles.saveButtonText}>Mentés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    backgroundColor: COLORS.accentRed,
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  cardValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 4,
  },
  cardUnit: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 16,
  },
  cardNote: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  waterButton: {
    backgroundColor: COLORS.secondaryGreen,
  },
  sleepButton: {
    backgroundColor: '#6366F1',
  },
  refreshButton: {
    backgroundColor: COLORS.gray,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  healthKitNote: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  healthKitNoteText: {
    fontSize: 14,
    color: COLORS.secondaryGreen,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  notAvailableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notAvailableIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  notAvailableTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 12,
    textAlign: 'center',
  },
  notAvailableText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.backgroundLight,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primaryBlue,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
