import { Settings, Star, Bell, Users, Gift, Zap, Shield, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';

export default function HomePage() {
  const { getFeatureValue } = useFeatureFlags();

  // Get feature flag values from context
  const features = {
    showWelcomeCard: getFeatureValue('showWelcomeCard'),
    showStatsCard: getFeatureValue('showStatsCard'),
    showPromoBanner: getFeatureValue('showPromoBanner'),
    enableDarkMode: getFeatureValue('enableDarkMode'),
    showNotifications: getFeatureValue('showNotifications'),
    showUserProfile: getFeatureValue('showUserProfile'),
    enableNewButton: getFeatureValue('enableNewButton'),
    showFooter: getFeatureValue('showFooter'),
    showSidebar: getFeatureValue('showSidebar'),
    enableAnimations: getFeatureValue('enableAnimations')
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      features.enableDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`p-6 border-b ${
        features.enableDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feature Flag Demo</h1>
          <div className="flex items-center space-x-4">
            {features.showNotifications && (
              <div className="relative">
                <Bell className="w-6 h-6 cursor-pointer hover:text-blue-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
            )}
            
            {features.showUserProfile && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">John Doe</span>
              </div>
            )}
            
            <button
              onClick={() => window.location.href = '/login'}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm"
            >
              <Settings className="w-4 h-4" />
              <Link to="/admin">Admin</Link>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {features.showSidebar && (
          <aside className={`w-64 p-6 border-r ${
            features.enableDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#" className="block p-2 rounded hover:bg-blue-100 hover:text-blue-600">Dashboard</a></li>
              <li><a href="#" className="block p-2 rounded hover:bg-blue-100 hover:text-blue-600">Analytics</a></li>
              <li><a href="#" className="block p-2 rounded hover:bg-blue-100 hover:text-blue-600">Settings</a></li>
              <li><a href="#" className="block p-2 rounded hover:bg-blue-100 hover:text-blue-600">Help</a></li>
            </ul>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Promo Banner */}
          {features.showPromoBanner && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 border-orange-500 ${
              features.enableAnimations ? 'animate-pulse' : ''
            } ${features.enableDarkMode ? 'bg-orange-900 bg-opacity-20' : 'bg-orange-50'}`}>
              <div className="flex items-center">
                <Gift className="w-6 h-6 text-orange-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-orange-800">Special Offer!</h3>
                  <p className="text-orange-700">Get 50% off premium features this month only.</p>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Card */}
          {features.showWelcomeCard && (
            <div className={`mb-6 p-6 rounded-lg shadow-sm ${
              features.enableDarkMode ? 'bg-gray-800' : 'bg-white'
            } ${features.enableAnimations ? 'transform hover:scale-105 transition-transform duration-300' : ''}`}>
              <div className="flex items-center mb-4">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold">Welcome to the Platform!</h2>
                  <p className={features.enableDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    This card appears when the 'showWelcomeCard' feature flag is enabled.
                  </p>
                </div>
              </div>
              <p className={features.enableDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                You can control the visibility of different sections using the admin dashboard.
              </p>
            </div>
          )}

          {/* Stats Card */}
          {features.showStatsCard && (
            <div className={`mb-6 p-6 rounded-lg shadow-sm ${
              features.enableDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Statistics Dashboard
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">1,234</div>
                  <div className={`text-sm ${features.enableDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">89%</div>
                  <div className={`text-sm ${features.enableDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">456</div>
                  <div className={`text-sm ${features.enableDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Sessions</div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-lg shadow-sm ${
              features.enableDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <Zap className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Performance</h3>
              <p className={features.enableDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                This card is always visible to demonstrate the base functionality.
              </p>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${
              features.enableDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <Shield className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className={features.enableDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Another permanent card showing consistent content.
              </p>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${
              features.enableDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <Users className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className={features.enableDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Work together seamlessly with your team members.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Standard Button
            </button>
            
            {features.enableNewButton && (
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600">
                ✨ New Feature Button
              </button>
            )}
            
            <button className={`border-2 border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 ${
              features.enableDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''
            }`}>
              Secondary Action
            </button>
          </div>

          {/* Feature Flag Status Indicator */}
          <div className={`p-4 rounded-lg ${
            features.enableDarkMode ? 'bg-gray-800' : 'bg-blue-50'
          } border border-blue-200`}>
            <h4 className="font-semibold mb-2 text-blue-700">Current Feature Flag Status:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(features).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    value ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className={`${features.enableDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key}: {value ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      {features.showFooter && (
        <footer className={`mt-12 p-6 border-t ${
          features.enableDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={features.enableDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              This footer appears when the 'showFooter' feature flag is enabled.
            </p>
            <p className="text-sm mt-2">
              © 2025 Feature Flag Demo. Control these elements from your admin dashboard!
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}