import React from 'react';
import { Layout } from './components/Layout';
import { UserListRefBased } from './components/UserListRefBased';

export function App() {
  return (
    <Layout>
      <UserListRefBased />
    </Layout>
  );
}

export default App;
