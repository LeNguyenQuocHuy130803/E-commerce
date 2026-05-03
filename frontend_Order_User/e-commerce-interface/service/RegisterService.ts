
// ✅ Interface for API request - only required fields
export interface RegisterRequest {
  email: string
  userName: string
  password: string
  phoneNumber: string
}



export async function registerUser(data: RegisterRequest) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔒 Include cookies
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(
        responseData.message || 'Registration failed'
      )
    }

    return responseData.user
  } catch (error: unknown) {
    throw new Error((error as Error).message || 'Registration request failed')
  }
}
