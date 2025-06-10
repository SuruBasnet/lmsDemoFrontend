import { StudentInfo } from "../types";
import Cookies from 'js-cookie';

export async function getStudents(): Promise<{
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}> {
  const authToken = Cookies.get('auth_token');
  try {

    const response = await fetch('https://surubasnet.pythonanywhere.com/api/v1/students/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      }
    });


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
      data: data.results || data, // Handle both paginated and non-paginated responses
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

export async function retrieveStudents(id:number): Promise<{
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}> {
  const authToken = Cookies.get('auth_token');
  try {

    const response = await fetch(`https://surubasnet.pythonanywhere.com/api/v1/students/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      }
    });


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
      data: data.results || data, // Handle both paginated and non-paginated responses
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

export async function searchStudents(searchValue:string): Promise<{
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}> {
  const authToken = Cookies.get('auth_token');
  try {

    const response = await fetch(`https://surubasnet.pythonanywhere.com/api/v1/students/?search=${searchValue}`, {
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


export async function createStudent(studentData: any): Promise<{
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}> {
  const authToken = Cookies.get('auth_token');
  try {
    const response = await fetch('https://surubasnet.pythonanywhere.com/api/v1/students/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
      body: JSON.stringify(studentData)
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Failed!';
      if (data.name) errorMessage = data.name.join(' ');
      else if (data.session) errorMessage = data.session.join(' ');
      else if (data.plan) errorMessage = data.plan.join(' ');
      else if (data.email) errorMessage = data.email.join(' ');
      else if (data.status) errorMessage = data.status.join(' ');
      else if (data.detail) errorMessage = data.detail;
      return {
        success: false,
        message: errorMessage,
        error: data
      };
    }
      

    return {
      success: true,
      data: data,
      message: 'Student created successfully!'
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

export async function updateStudent(studentData: any, id: number): Promise<{
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}> {
  const authToken = Cookies.get('auth_token');
  try {
    const response = await fetch(`https://surubasnet.pythonanywhere.com/api/v1/students/${id}/`, {
      method: 'PUT', // changed from POST to PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
      body: JSON.stringify(studentData)
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Failed!';
      if (data.name) errorMessage = data.name.join(' ');
      else if (data.session) errorMessage = data.session.join(' ');
      else if (data.plan) errorMessage = data.plan.join(' ');
      else if (data.email) errorMessage = data.email.join(' ');
      else if (data.status) errorMessage = data.status.join(' ');
      else if (data.detail) errorMessage = data.detail;
      return {
        success: false,
        message: errorMessage,
        error: data
      };
    }

    return {
      success: true,
      data: data,
      message: 'Student updated successfully!' // updated message
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

export async function deleteStudent(id: number): Promise<{
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}> {
  const authToken = Cookies.get('auth_token');
  try {
    const response = await fetch(`https://surubasnet.pythonanywhere.com/api/v1/students/${id}/`, {
      method: 'DELETE', // changed from POST to PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      }
    });

    
    if (!response.ok) {
      const data = await response.json();
      let errorMessage = 'Failed!';
      if (data.name) errorMessage = data.name.join(' ');
      else if (data.session) errorMessage = data.session.join(' ');
      else if (data.plan) errorMessage = data.plan.join(' ');
      else if (data.email) errorMessage = data.email.join(' ');
      else if (data.status) errorMessage = data.status.join(' ');
      else if (data.detail) errorMessage = data.detail;
      return {
        success: false,
        message: errorMessage,
        error: data
      };
    }

    return {
      success: true,
      message: 'Student deleted successfully!' // updated message
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