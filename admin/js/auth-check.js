// Check if user is authenticated
async function checkAuthentication() {
  try {
    const response = await fetch('/auth/check');
    const data = await response.json();

    if (!data.authenticated) {
      // Redirect to Google login
      window.location.href = '/auth/google';
      return false;
    }

    // Show admin panel
    document.getElementById('auth-check').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');

    // Display user email
    if (data.user?.email) {
      document.getElementById('user-email').textContent = `Logado como: ${data.user.email}`;
    }

    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    // Assume not authenticated on error
    window.location.href = '/auth/google';
  }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
});
