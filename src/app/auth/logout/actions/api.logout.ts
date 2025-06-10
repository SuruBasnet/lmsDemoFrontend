import Cookies from 'js-cookie';

export default async function LogoutApi() {
  try {
    const authToken = Cookies.get('auth_token');
    const response = await fetch('https://surubasnet.pythonanywhere.com/api/v1/auth/token/logout/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      }
    });

    
    if (!response.status ) {
        const data = await response.json();
      let errorMessage = 'Logout failed';
      if (data.non_field_errors) errorMessage = data.non_field_errors.join(' ');
      else if (data.detail) errorMessage = data.detail;
      
      return {
        success: false,
        message: errorMessage,
        error: data
      };
    }

    return {
      success: true,
      message: 'Logout successful!'
    };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error: error instanceof Error ? error : new Error(errorMessage)
    };
  }
}