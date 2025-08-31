import { apiService } from '@/services/api';

// Test function to verify token is working
export function testToken() {
    console.log('🧪 Testing token functionality...');

    // Check localStorage
    const token = localStorage.getItem('auth-token');
    console.log('🔍 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NULL');

    // Check visible cookies (HTTP-only cookies not accessible)
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    const cookieToken = authCookie ? authCookie.split('=')[1] : null;
    console.log('🔍 Token from visible cookie:', cookieToken ? `${cookieToken.substring(0, 20)}...` : 'NULL');

    // Note: HTTP-only cookies are not accessible from JavaScript
    console.log('🔍 Note: HTTP-only cookies (like auth-token) are not visible to JavaScript');
    console.log('🔍 But they are accessible to server-side code (proxy routes)');

    // Check which token will be used by API Service
    const finalToken = token || cookieToken;
    console.log('🔍 Token that API Service will use:', finalToken ? `${finalToken.substring(0, 20)}...` : 'NULL');

    // Test API call
    console.log('🌐 Testing API call to locations...');

    apiService.getLocations()
        .then(response => {
            console.log('✅ API call successful:', response);
        })
        .catch(error => {
            console.error('❌ API call failed:', error);
        });
}

// Make it available globally for console testing
if (typeof window !== 'undefined') {
    (window as any).testToken = testToken;
    console.log('🧪 Token test function available at window.testToken()');
}
