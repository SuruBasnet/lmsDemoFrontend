import { User } from "../types";
import Cookies from 'js-cookie';

export async function getUser(): Promise<{
  success: boolean;
  data?: User;
  message?: string;
  error?: Error;
}> {
  const authToken = Cookies.get('auth_token');
  try {

    const response = await fetch(`https://surubasnet.pythonanywhere.com/api/v1/auth/users/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      }
    });

    console.log(localStorage.getItem('auth_token'));

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Failed to fetch students';
      if (data.detail) errorMessage = data.detail;
      else if (data.non_field_errors) errorMessage = data.non_field_errors.join(' ');
      
      return {
        success: false,
        message: errorMessage,
        error: data
      };
    }

    return {
      success: true,
      data: data.results || data,
      message: 'Students fetched successfully!'
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