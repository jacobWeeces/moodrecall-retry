import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import * as Switch from '@radix-ui/react-switch';
import * as Dialog from '@radix-ui/react-dialog';
import * as Toast from '@radix-ui/react-toast';

const Settings = () => {
  const user = useStore((state) => state.user);
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({
        notification_preferences: {
          ...user.notification_preferences,
          enabled,
        },
      })
      .eq('id', user.id);

    if (!error) {
      setToastMessage('Notification preferences updated');
      setShowToast(true);
    }
  };

  const handleMedicationReminderToggle = async (enabled: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({
        medication_reminder: {
          ...user.medication_reminder,
          enabled,
        },
      })
      .eq('id', user.id);

    if (!error) {
      setToastMessage('Medication reminder settings updated');
      setShowToast(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    if (!error) {
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode" className="text-sm">Dark Mode</label>
            <Switch.Root
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="w-11 h-6 bg-white/10 rounded-full relative data-[state=checked]:bg-cyan-400 transition-colors"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="notifications" className="text-sm">Enable Notifications</label>
              <Switch.Root
                id="notifications"
                checked={user?.notification_preferences.enabled}
                onCheckedChange={handleNotificationToggle}
                className="w-11 h-6 bg-white/10 rounded-full relative data-[state=checked]:bg-cyan-400 transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="medication-reminder" className="text-sm">Medication Reminder</label>
              <Switch.Root
                id="medication-reminder"
                checked={user?.medication_reminder.enabled}
                onCheckedChange={handleMedicationReminderToggle}
                className="w-11 h-6 bg-white/10 rounded-full relative data-[state=checked]:bg-cyan-400 transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4 text-red-400">Danger Zone</h2>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg py-2 hover:bg-red-500/20 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-midnight-900 rounded-2xl p-6 w-[90vw] max-w-md">
            <Dialog.Title className="text-xl font-bold mb-4">Delete Account</Dialog.Title>
            <Dialog.Description className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-white/10 hover:opacity-90"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Toast.Provider>
        <Toast.Root
          open={showToast}
          onOpenChange={setShowToast}
          className="fixed bottom-20 right-4 bg-white dark:bg-midnight-900 rounded-lg shadow-lg p-4"
        >
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
};

export default Settings;