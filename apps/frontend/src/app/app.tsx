import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { UserListRefBased } from './components/UserListRefBased';
import { UserProfile } from './components/UserProfile';
import { Toast } from './components/Toast';

export function App() {
  const [currentView, setCurrentView] = useState<'list' | 'profile'>('list');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigateToProfile = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('profile');
  };

  const navigateToList = () => {
    setCurrentView('list');
    setSelectedUserId(null);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  return (
    <Layout onNavigateHome={navigateToList}>
      {currentView === 'list' ? (
        <UserListRefBased onUserClick={navigateToProfile} onShowToast={showToast} />
      ) : (
        <UserProfile userId={selectedUserId!} onBack={navigateToList} onShowToast={showToast} />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </Layout>
  );
}

export default App;
