'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

// Types
interface Subscription {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  nextBillingDate: string;
}

interface Activity {
  id: string;
  type: 'payment' | 'subscription' | 'invoice' | 'update';
  message: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

export default function DashboardClient() {
  const [subscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Pro Plan',
      status: 'active',
      amount: 49.99,
      currency: 'USD',
      nextBillingDate: '2024-08-15',
    },
    {
      id: '2',
      name: 'Team Plan',
      status: 'active',
      amount: 99.99,
      currency: 'USD',
      nextBillingDate: '2024-08-22',
    },
    {
      id: '3',
      name: 'Starter Plan',
      status: 'expired',
      amount: 19.99,
      currency: 'USD',
      nextBillingDate: '2024-06-01',
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'payment',
      message: 'Payment of $49.99 received for Pro Plan',
      date: '2024-07-15 14:30',
      status: 'success',
    },
    {
      id: '2',
      type: 'subscription',
      message: 'Team Plan subscription activated',
      date: '2024-07-14 10:00',
      status: 'success',
    },
    {
      id: '3',
      type: 'invoice',
      message: 'Invoice #INV-2024-001 generated',
      date: '2024-07-13 09:15',
      status: 'pending',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Stats calculation
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active').length;
  const totalMonthlyRevenue = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return '💳';
      case 'subscription':
        return '📋';
      case 'invoice':
        return '📄';
      case 'update':
        return '🔄';
      default:
        return '📌';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s an overview of your billing and subscriptions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900">{totalSubscriptions}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {activeSubscriptions} active • {totalSubscriptions - activeSubscriptions} inactive
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-600">${totalMonthlyRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              Next billing:{' '}
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-purple-600">24</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">+3 this month</span>
          </div>
        </div>
      </div>

      {/* Subscriptions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Subscriptions</h2>
                <Link
                  href="/dashboard/subscriptions/new"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Subscription
                </Link>
              </div>
            </div>
            <div className="p-6">
              {subscriptions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No subscriptions yet. Add your first subscription to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{subscription.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subscription.status)}`}
                          >
                            {subscription.status.charAt(0).toUpperCase() +
                              subscription.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Next billing:{' '}
                            {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${subscription.amount.toFixed(2)}
                          <span className="text-sm font-normal text-gray-500">
                            /{subscription.currency}
                          </span>
                        </p>
                        <Link
                          href={`/dashboard/subscriptions/${subscription.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity.</p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3"
                    >
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs font-medium ${getActivityStatusColor(activity.status)}`}
                          >
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-400">{activity.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/subscriptions/new"
          className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl mb-1">➕</div>
          <p className="text-sm font-medium text-gray-900">New Subscription</p>
        </Link>
        <Link
          href="/dashboard/invoices"
          className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl mb-1">📄</div>
          <p className="text-sm font-medium text-gray-900">View Invoices</p>
        </Link>
        <Link
          href="/dashboard/payments"
          className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl mb-1">💳</div>
          <p className="text-sm font-medium text-gray-900">Make Payment</p>
        </Link>
        <Link
          href="/profile"
          className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl mb-1">⚙️</div>
          <p className="text-sm font-medium text-gray-900">Settings</p>
        </Link>
      </div>
    </div>
  );
}
