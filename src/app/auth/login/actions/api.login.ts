export type LoginCredentials = {
  username: string;
  password: string;
};

export default async function LoginApi({ username, password }: LoginCredentials) {
  try {
    const response = await fetch('https://surubasnet.pythonanywhere.com/api/v1/auth/token/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Login failed';
      if (data.non_field_errors) errorMessage = data.non_field_errors.join(' ');
      else if (data.detail) errorMessage = data.detail;
      
      return {
        success: false,
        message: errorMessage,
        error: data
      };
    }

    // The server should set the auth cookies automatically with credentials: 'include'
    // If you need to handle the token manually, you would do it here:
    document.cookie = `auth_token=${data.auth_token}; path=/; secure; samesite=strict`;

    return {
      success: true,
      data,
      message: 'Login successful!'
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