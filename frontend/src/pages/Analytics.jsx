import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../services/predictionService';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7days');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics(period);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Comprehensive insights into your prediction data
          </p>
        </div>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input-field w-40"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Revenue Potential</p>
              <p className="text-3xl font-bold mt-2">
                ${analytics?.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-sm opacity-75 mt-2">
                From interested customers
              </p>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 opacity-75" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Conversion Rate</p>
              <p className="text-3xl font-bold mt-2">
                {analytics?.conversionRate || 0}%
              </p>
              <p className="text-sm opacity-75 mt-2">
                Interest to total ratio
              </p>
            </div>
            <ArrowTrendingUpIcon className="h-12 w-12 opacity-75" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg Premium</p>
              <p className="text-3xl font-bold mt-2">
                ${analytics?.avgPremium?.toLocaleString() || 0}
              </p>
              <p className="text-sm opacity-75 mt-2">
                Per customer
              </p>
            </div>
            <ChartBarIcon className="h-12 w-12 opacity-75" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Customers</p>
              <p className="text-3xl font-bold mt-2">
                {analytics?.totalCustomers?.toLocaleString() || 0}
              </p>
              <p className="text-sm opacity-75 mt-2">
                Analyzed so far
              </p>
            </div>
            <UserGroupIcon className="h-12 w-12 opacity-75" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Over Time */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Prediction Trends Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="interested" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="notInterested" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Age Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.ageDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="interested" fill="#10b981" />
              <Bar dataKey="notInterested" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Gender-Based Interest
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.genderData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(analytics?.genderData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Age Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vehicle Age Impact
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.vehicleAgeData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicleAge" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="interested" fill="#3b82f6" />
              <Bar dataKey="notInterested" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Premium Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Premium Range Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.premiumData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Regions by Interest
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.regionalData || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="region" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="interestRate" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics?.insights?.map((insight, index) => (
            <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-semibold">💡 </span>
                {insight}
              </p>
            </div>
          )) || (
            <>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-semibold">💡 </span>
                  Customers with vehicle damage history show higher interest in insurance
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <span className="font-semibold">💡 </span>
                  Age group 30-45 has the highest conversion rate
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-800 dark:text-purple-300">
                  <span className="font-semibold">💡 </span>
                  Previously uninsured customers are prime targets
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  <span className="font-semibold">💡 </span>
                  Vehicles older than 2 years show increased interest
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
