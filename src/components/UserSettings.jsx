import { useState } from 'react';
import '../styles/usersettings.css';

export default function UserSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      shareActivity: true,
      showProgress: true
    },
    theme: 'light',
    language: 'english'
  });

  const handleNotificationChange = (type) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type]
      }
    });
  };

  const handlePrivacyChange = (setting, value) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [setting]: value
      }
    });
  };

  const handleThemeChange = (e) => {
    setSettings({
      ...settings,
      theme: e.target.value
    });
  };

  const handleLanguageChange = (e) => {
    setSettings({
      ...settings,
      language: e.target.value
    });
  };

  const saveSettings = () => {
    // Here you would typically send the settings to your backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="tzkset-container">
      <h1 className="tzkset-title">Account Settings</h1>
      
      <section className="tzkset-section">
        <h2>Notifications</h2>
        <div className="tzkset-option">
          <label className="tzkset-switch">
            <input 
              type="checkbox" 
              checked={settings.notifications.email} 
              onChange={() => handleNotificationChange('email')}
            />
            <span className="tzkset-slider"></span>
          </label>
          <div className="tzkset-label">
            <h3>Email Notifications</h3>
            <p>Receive course updates and announcements via email</p>
          </div>
        </div>
        
        <div className="tzkset-option">
          <label className="tzkset-switch">
            <input 
              type="checkbox" 
              checked={settings.notifications.push} 
              onChange={() => handleNotificationChange('push')}
            />
            <span className="tzkset-slider"></span>
          </label>
          <div className="tzkset-label">
            <h3>Push Notifications</h3>
            <p>Get instant updates on your device</p>
          </div>
        </div>
        
        <div className="tzkset-option">
          <label className="tzkset-switch">
            <input 
              type="checkbox" 
              checked={settings.notifications.sms} 
              onChange={() => handleNotificationChange('sms')}
            />
            <span className="tzkset-slider"></span>
          </label>
          <div className="tzkset-label">
            <h3>SMS Notifications</h3>
            <p>Receive text messages for important updates</p>
          </div>
        </div>
      </section>
      
      <section className="tzkset-section">
        <h2>Privacy</h2>
        <div className="tzkset-option">
          <div className="tzkset-select-container">
            <label htmlFor="profileVisibility">Profile Visibility</label>
            <select 
              id="profileVisibility" 
              value={settings.privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        
        <div className="tzkset-option">
          <label className="tzkset-switch">
            <input 
              type="checkbox" 
              checked={settings.privacy.shareActivity} 
              onChange={() => handlePrivacyChange('shareActivity', !settings.privacy.shareActivity)}
            />
            <span className="tzkset-slider"></span>
          </label>
          <div className="tzkset-label">
            <h3>Share Learning Activity</h3>
            <p>Allow others to see your course progress and achievements</p>
          </div>
        </div>
        
        <div className="tzkset-option">
          <label className="tzkset-switch">
            <input 
              type="checkbox" 
              checked={settings.privacy.showProgress} 
              onChange={() => handlePrivacyChange('showProgress', !settings.privacy.showProgress)}
            />
            <span className="tzkset-slider"></span>
          </label>
          <div className="tzkset-label">
            <h3>Show Progress Bar</h3>
            <p>Display your progress on your public profile</p>
          </div>
        </div>
      </section>
      
      <section className="tzkset-section">
        <h2>Appearance</h2>
        <div className="tzkset-option">
          <div className="tzkset-select-container">
            <label htmlFor="theme">Theme</label>
            <select 
              id="theme" 
              value={settings.theme}
              onChange={handleThemeChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">Use System Preference</option>
            </select>
          </div>
        </div>
        
        <div className="tzkset-option">
          <div className="tzkset-select-container">
            <label htmlFor="language">Language</label>
            <select 
              id="language" 
              value={settings.language}
              onChange={handleLanguageChange}
            >
              <option value="english">English</option>
              <option value="spanish">Español</option>
              <option value="french">Français</option>
              <option value="arabic">العربية</option>
            </select>
          </div>
        </div>
      </section>
      
      <section className="tzkset-section">
        <h2>Account Management</h2>
        <div className="tzkset-button-group">
          <button className="tzkset-button tzkset-primary" onClick={saveSettings}>Save Changes</button>
          <button className="tzkset-button tzkset-secondary">Reset Password</button>
          <button className="tzkset-button tzkset-danger">Delete Account</button>
        </div>
      </section>
    </div>
  );
}