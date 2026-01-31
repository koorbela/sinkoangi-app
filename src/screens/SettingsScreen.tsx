import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

interface SettingsScreenProps {
  onGoBack: () => void;
}

const COLORS = {
  primaryBlue: '#020887',
  secondaryGreen: '#00635D',
  backgroundLight: '#DBE4EE',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

const STORAGE_KEYS = {
  REMINDER_ENABLED: 'reminder_enabled',
  REMINDER_TIME: 'reminder_time',
};

export function SettingsScreen({ onGoBack }: SettingsScreenProps) {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date(2024, 0, 1, 8, 0));
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.REMINDER_ENABLED);
      const timeStr = await AsyncStorage.getItem(STORAGE_KEYS.REMINDER_TIME);
      
      console.log('Loaded settings - enabled:', enabled, 'time:', timeStr);
      
      if (enabled === 'true') {
        setReminderEnabled(true);
      }
      
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        setReminderTime(new Date(2024, 0, 1, hours, minutes));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleReminder = (newValue: boolean) => {
    console.log('Toggle reminder to:', newValue);
    setReminderEnabled(newValue);
    
    // Save asynchronously
    AsyncStorage.setItem(STORAGE_KEYS.REMINDER_ENABLED, String(newValue))
      .then(() => console.log('Saved reminder enabled:', newValue))
      .catch((error) => console.error('Error saving:', error));
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      console.log('Time selected:', selectedTime);
      setReminderTime(selectedTime);
      
      const timeStr = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;
      AsyncStorage.setItem(STORAGE_KEYS.REMINDER_TIME, timeStr)
        .then(() => console.log('Saved time:', timeStr))
        .catch((error) => console.error('Error saving time:', error));
    }
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Vissza</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beállítások</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Napi emlékeztető</Text>
            <Text style={styles.settingDescription}>
              Kapj értesítést minden nap a beállított időpontban
            </Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={toggleReminder}
            trackColor={{ false: '#D1D5DB', true: COLORS.secondaryGreen }}
            thumbColor={reminderEnabled ? COLORS.white : '#F9FAFB'}
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {reminderEnabled && (
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Emlékeztető időpontja</Text>
              <Text style={styles.settingDescription}>
                Válaszd ki, mikor kapj értesítést
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(reminderTime)}</Text>
              <Text style={styles.timeArrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {Platform.OS === 'ios' && showTimePicker && (
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => setShowTimePicker(false)}
          >
            <Text style={styles.doneButtonText}>Kész</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
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
  content: {
    padding: 16,
  },
  settingRow: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryBlue,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondaryGreen,
  },
  timeArrow: {
    fontSize: 24,
    color: COLORS.gray,
    marginLeft: 8,
  },
  doneButton: {
    backgroundColor: COLORS.secondaryGreen,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
