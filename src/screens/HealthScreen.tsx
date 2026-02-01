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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';

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

const STORAGE_KEYS = {
  weight: 'health_weight',
  waterIntake: 'health_water_intake',
  waterDate: 'health_water_date',
  sleepHours: 'health_sleep_hours',
  sleepDate: 'health_sleep_date',
  manualSteps: 'health_manual_steps',
  manualStepsDate: 'health_manual_steps_date',
};

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function HealthScreen({ onGoBack }: HealthScreenProps) {
  const [stepCount, setStepCount] = useState<number>(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [sleepHours, setSleepHours] = useState<string>('');
  
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [sleepInput, setSleepInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');

  useEffect(() => {
    loadHealthData();
    setupPedometer();
  }, []);

  const loadHealthData = async () => {
    try {
      const savedWeight = await AsyncStorage.getItem(STORAGE_KEYS.weight);
      if (savedWeight) setWeight(savedWeight);

      const savedWaterDate = await AsyncStorage.getItem(STORAGE_KEYS.waterDate);
      const today = getTodayDateString();
      
      if (savedWaterDate === today) {
        const savedWater = await AsyncStorage.getItem(STORAGE_KEYS.waterIntake);
        if (savedWater) setWaterIntake(parseFloat(savedWater));
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.waterIntake, '0');
        await AsyncStorage.setItem(STORAGE_KEYS.waterDate, today);
        setWaterIntake(0);
      }

      const savedSleepDate = await AsyncStorage.getItem(STORAGE_KEYS.sleepDate);
      if (savedSleepDate === today) {
        const savedSleep = await AsyncStorage.getItem(STORAGE_KEYS.sleepHours);
        if (savedSleep) setSleepHours(savedSleep);
      } else {
        setSleepHours('');
      }

      const savedStepsDate = await AsyncStorage.getItem(STORAGE_KEYS.manualStepsDate);
      if (savedStepsDate === today) {
        const savedSteps = await AsyncStorage.getItem(STORAGE_KEYS.manualSteps);
        if (savedSteps) setStepCount(parseInt(savedSteps, 10));
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const setupPedometer = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const result = await Pedometer.getStepCountAsync(start, end);
        if (result) {
          setStepCount(result.steps);
        }

        const subscription = Pedometer.watchStepCount((result) => {
          setStepCount((prev) => prev + result.steps);
        });

        return () => subscription.remove();
      }
    } catch (error) {
      console.error('Pedometer error:', error);
      setIsPedometerAvailable(false);
    }
  };

  const saveWeight = async () => {
    if (!weightInput || isNaN(parseFloat(weightInput))) {
      Alert.alert('Hiba', 'Kérlek adj meg egy érvényes számot!');
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.weight, weightInput);
      setWeight(weightInput);
      setShowWeightModal(false);
      setWeightInput('');
    } catch (error) {
      console.error('Error saving weight:', error);
    }
  };

  const addWater = async () => {
    try {
      const newAmount = waterIntake + 0.25;
      await AsyncStorage.setItem(STORAGE_KEYS.waterIntake, newAmount.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.waterDate, getTodayDateString());
      setWaterIntake(newAmount);
    } catch (error) {
      console.error('Error saving water intake:', error);
    }
  };

  const saveSleep = async () => {
    if (!sleepInput || isNaN(parseFloat(sleepInput))) {
      Alert.alert('Hiba', 'Kérlek adj meg egy érvényes számot!');
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.sleepHours, sleepInput);
      await AsyncStorage.setItem(STORAGE_KEYS.sleepDate, getTodayDateString());
      setSleepHours(sleepInput);
      setShowSleepModal(false);
      setSleepInput('');
    } catch (error) {
      console.error('Error saving sleep:', error);
    }
  };

  const saveManualSteps = async () => {
    if (!stepsInput || isNaN(parseInt(stepsInput, 10))) {
      Alert.alert('Hiba', 'Kérlek adj meg egy érvényes számot!');
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.manualSteps, stepsInput);
      await AsyncStorage.setItem(STORAGE_KEYS.manualStepsDate, getTodayDateString());
      setStepCount(parseInt(stepsInput, 10));
      setShowStepsModal(false);
      setStepsInput('');
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

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
          {isPedometerAvailable === false && (
            <>
              <Text style={styles.cardNote}>
                A lépésszámláló nem elérhető ezen az eszközön
              </Text>
              <TouchableOpacity 
                style={[styles.actionButton, styles.stepsButton]}
                onPress={() => {
                  setStepsInput(stepCount.toString());
                  setShowStepsModal(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>Lépések rögzítése</Text>
              </TouchableOpacity>
            </>
          )}
          {isPedometerAvailable === true && (
            <Text style={styles.cardNoteSuccess}>
              Automatikus lépésszámlálás aktív
            </Text>
          )}
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
          <Text style={styles.cardUnit}>óra ma éjjel</Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.sleepButton]}
            onPress={() => {
              setSleepInput(sleepHours);
              setShowSleepModal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Alvás rögzítése</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.healthKitNote}>
          <Text style={styles.healthKitNoteText}>
            Az adatok helyben mentődnek az eszközön.
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

      <Modal
        visible={showStepsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStepsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lépések rögzítése</Text>
            <Text style={styles.modalSubtitle}>Mai lépésszám</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="pl. 8000"
              keyboardType="number-pad"
              value={stepsInput}
              onChangeText={setStepsInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStepsModal(false)}
              >
                <Text style={styles.cancelButtonText}>Mégsem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveManualSteps}
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
    marginBottom: 12,
  },
  cardNoteSuccess: {
    fontSize: 12,
    color: COLORS.secondaryGreen,
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
  stepsButton: {
    backgroundColor: COLORS.accentYellow,
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
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
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
