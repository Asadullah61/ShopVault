import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSaving(false); }
  };

  return (
    <div className="profile-page">
      <div className="container-sm">
        <div className="page-header">
          <h1>Account Settings</h1>
        </div>

        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-nav">
            <div className="profile-avatar-big">{user?.name?.[0]?.toUpperCase()}</div>
            <p className="profile-name">{user?.name}</p>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-tabs">
              <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile Info</button>
              <button className={tab === 'password' ? 'active' : ''} onClick={() => setTab('password')}>Password</button>
            </div>
          </div>

          {/* Content */}
          <div className="profile-content">
            {tab === 'profile' && (
              <div className="profile-card card animate-in">
                <h2>Profile Information</h2>
                <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input value={user?.role} disabled style={{ opacity: 0.5 }} />
                  </div>
                  <div className="form-group">
                    <label>Member Since</label>
                    <input value={new Date(user?.createdAt).toLocaleDateString()} disabled style={{ opacity: 0.5 }} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <div className="profile-card card animate-in">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" value={pwForm.currentPassword}
                      onChange={e => setPwForm(f => ({...f, currentPassword: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" value={pwForm.newPassword}
                      onChange={e => setPwForm(f => ({...f, newPassword: e.target.value}))} minLength={6} required />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({...f, confirm: e.target.value}))} required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Changing…' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
