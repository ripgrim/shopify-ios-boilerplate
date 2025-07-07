import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AddressList from '@/components/customer/AddressList';
import CustomerProfile from '@/components/customer/CustomerProfile';
import EditProfile from '@/components/customer/EditProfile';
import OrdersList from '@/components/customer/OrdersList';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AccountView = 'profile' | 'editProfile' | 'orders' | 'addresses';

const AccountScreen = () => {
  const [currentView, setCurrentView] = useState<AccountView>('profile');

  const handleEditProfile = () => {
    // setCurrentView('editProfile');
    Alert.alert('Coming Soon', 'This feature is not available yet.');
  };

  const handleViewOrders = () => {
    // setCurrentView('orders');
    Alert.alert('Coming Soon', 'This feature is not available yet.');
  };

  const handleManageAddresses = () => {
    // setCurrentView('addresses');
    Alert.alert('Coming Soon', 'This feature is not available yet.');
  };

  const handleBack = () => {
    setCurrentView('profile');
  };

  const handleSaveProfile = (data: any) => {
    console.log('Profile saved:', data);
    setCurrentView('profile');
  };

  const handleOrderPress = (order: any) => {
    console.log('Order pressed:', order);
    // TODO: Navigate to order details
  };

  const handleAddressPress = (address: any) => {
    console.log('Address pressed:', address);
    // TODO: Navigate to address edit
  };

  const handleAddNewAddress = () => {
    console.log('Add new address');
    // TODO: Navigate to add address form
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'editProfile':
        return (
          <EditProfile 
            onBack={handleBack}
            onSave={handleSaveProfile}
          />
        );
      case 'orders':
        return (
          <OrdersList 
            onOrderPress={handleOrderPress}
          />
        );
      case 'addresses':
        return (
          <AddressList 
            onAddressPress={handleAddressPress}
            onAddNew={handleAddNewAddress}
            onBack={handleBack}
          />
        );
      default:
        return (
          <CustomerProfile
            onEditProfile={handleEditProfile}
            onViewOrders={handleViewOrders}
            onManageAddresses={handleManageAddresses}
          />
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ProtectedRoute>
        {renderCurrentView()}
      </ProtectedRoute>
    </SafeAreaView>
  );
};

export default AccountScreen; 