import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [predictionNotifications, setPredictionNotifications] = useState(true);

  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Must be at least 2 characters').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phone: Yup.string().min(10, 'Must be valid phone number'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.put('/api/user/profile', values);
        toast.success('Profile updated successfully!');
      } catch (error) {
        toast.error('Failed to update profile');
        console.error('Profile update error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Required'),
      newPassword: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.put('/api/user/password', {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toast.success('Password updated successfully!');
        passwordFormik.resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update password');
        console.error('Password update error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNotificationChange = async (type, value) => {
    try {
      await api.put('/api/user/notifications', {
        [type]: value,
      });
      toast.success('Notification preferences updated');
      
      if (type === 'emailNotifications') {
        setEmailNotifications(value);
      } else {
        setPredictionNotifications(value);
      }
    } catch (error) {
      toast.error('Failed to update preferences');
      console.error('Notification update error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <UserCircleIcon className="h-16 w-16 text-gray-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your personal information
            </p>
          </div>
        </div>

        <form onSubmit={profileFormik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="input-field"
                {...profileFormik.getFieldProps('name')}
              />
              {profileFormik.touched.name && profileFormik.errors.name && (
                <p className="mt-1 text-sm text-red-600">{profileFormik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                {...profileFormik.getFieldProps('email')}
              />
              {profileFormik.touched.email && profileFormik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{profileFormik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field"
                {...profileFormik.getFieldProps('phone')}
              />
              {profileFormik.touched.phone && profileFormik.errors.phone && (
                <p className="mt-1 text-sm text-red-600">{profileFormik.errors.phone}</p>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <KeyIcon className="h-16 w-16 text-gray-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Change Password
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="label">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              className="input-field"
              {...passwordFormik.getFieldProps('currentPassword')}
            />
            {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.currentPassword}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newPassword" className="label">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="input-field"
                {...passwordFormik.getFieldProps('newPassword')}
              />
              {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="input-field"
                {...passwordFormik.getFieldProps('confirmPassword')}
              />
              {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <BellIcon className="h-16 w-16 text-gray-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notification Preferences
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive email updates about your account
              </p>
            </div>
            <button
              onClick={() => handleNotificationChange('emailNotifications', !emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Prediction Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when predictions are completed
              </p>
            </div>
            <button
              onClick={() => handleNotificationChange('predictionNotifications', !predictionNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                predictionNotifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  predictionNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <ShieldCheckIcon className="h-16 w-16 text-gray-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Account Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View your account details
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Account Type</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {user?.role || 'User'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Member Since</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
