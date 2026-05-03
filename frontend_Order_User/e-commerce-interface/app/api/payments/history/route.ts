import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * GET /api/payments/history
 * Proxy to backend: GET /api/payments/history
 * Gets payment history
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const response = await fetch(`${apiUrl}/payments/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Backend history error:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('✅ Backend history success:', data)
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    console.error('❌ History route error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
