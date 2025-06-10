// api.register.ts
export type User = {
  email: string;
  username: string;
  profile: File;
  password: string;
};

export default async function RegisterApi({ email, username, profile, password }: User) {
  // Create FormData for file upload support
  const formData = new FormData();
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('profile', profile);

  try {
    const response = await fetch('https://surubasnet.pythonanywhere.com/api/v1/auth/users/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      if (data.email) errorMessage = data.email.join(' ');
      else if (data.username) errorMessage = data.username.join(' ');
      else if (data.password) errorMessage = data.password.join(' ');
      else if (data.detail) errorMessage = data.detail;
      return {
        success: false,
        message: errorMessage,
        error: data
      };
    }

    return {
      success: true,
      data,
      message: 'Registration successful!'
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