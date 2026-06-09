const db = require('../database/db');

function buildUserResponse(user, profile) {
  return {
    id: user.id,
    email: user.email,
    isOnboarded: user.is_onboarded === 1,
    fullName: profile?.full_name || '',
    phoneNumber: profile?.phone_number || '',
    avatarUrl: profile?.avatar_url || '',
    bio: profile?.bio || '',
  };
}

function getProfile(req, res, next) {
  try {
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);
    res.json({ user: buildUserResponse(req.user, profile) });
  } catch (err) {
    next(err);
  }
}

function updateProfile(req, res, next) {
  try {
    const { fullName, phoneNumber, avatarUrl, bio } = req.body;

    db.prepare(`
      UPDATE profiles
      SET full_name = ?, phone_number = ?, avatar_url = ?, bio = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      fullName ?? '',
      phoneNumber ?? '',
      avatarUrl ?? '',
      bio ?? '',
      req.user.id
    );

    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);
    res.json({ user: buildUserResponse(req.user, profile) });
  } catch (err) {
    next(err);
  }
}

function completeOnboarding(req, res, next) {
  try {
    const { fullName, phoneNumber } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    db.prepare(`
      UPDATE profiles
      SET full_name = ?, phone_number = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(fullName.trim(), phoneNumber.trim(), req.user.id);

    db.prepare(`UPDATE users SET is_onboarded = 1 WHERE id = ?`).run(req.user.id);

    const updatedUser = db.prepare('SELECT id, email, is_onboarded FROM users WHERE id = ?').get(req.user.id);
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);

    res.json({ user: buildUserResponse(updatedUser, profile) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, completeOnboarding };
