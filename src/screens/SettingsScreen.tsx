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
import * as Notifications from 'expo-notifications';
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

const NOTIFICATION_ID = 'daily-reminder';

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
      
      if (enabled !== null) {
        setReminderEnabled(enabled === 'true');
      }
      
      if (timeStr !== null) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const time = new Date(2024, 0, 1, hours, minutes);
        setReminderTime(time);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (enabled: boolean, time: Date) => {
    try {
      const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_ENABLED, enabled.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_TIME, timeStr);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const scheduleNotification = async (time: Date) => {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
    
    const trigger = {
      type: 'daily' as const,
      hour: time.getHours(),
      minute: time.getMinutes(),
    };

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: 'Napi emlékeztető',
        body: 'Ne felejtsd el a mai leckédet!',
      },
      trigger,
    });
  };

  const cancelNotification = async () => {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
  };

  const handleToggleReminder = async (value: boolean) => {
    setReminderEnabled(value);
    await saveSettings(value, reminderTime);
    
    if (value) {
      await scheduleNotification(reminderTime);
    } else {
      await cancelNotification();
    }
  };

  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedTime) {
      setReminderTime(selectedTime);
      await saveSettings(reminderEnabled, selectedTime);
      
      if (reminderEnabled) {
        await scheduleNotification(selectedTime);
      }
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
            onValueChange={handleToggleReminder}
            trackColor={{ false: COLORS.lightGray, true: COLORS.secondaryGreen }}
            thumbColor={COLORS.white}
          />
        </View>

        <TouchableOpacity 
          style={[styles.settingRow, !reminderEnabled && styles.disabled]}
          onPress={() => reminderEnabled && setShowTimePicker(true)}
          activeOpacity={reminderEnabled ? 0.7 : 1}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, !reminderEnabled && styles.disabledText]}>
              Emlékeztető időpontja
            </Text>
            <Text style={[styles.settingDescription, !reminderEnabled && styles.disabledText]}>
              Válaszd ki, mikor kapj értesítést
            </Text>
          </View>
          <Text style={[styles.timeText, !reminderEnabled && styles.disabledText]}>
            {formatTime(reminderTime)}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
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
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondaryGreen,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.gray,
  },
});
