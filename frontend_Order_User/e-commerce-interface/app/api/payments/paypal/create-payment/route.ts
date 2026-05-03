import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * POST /api/payments/paypal/create-payment
 * Proxy to backend: POST /api/payments/paypal/create-payment
 * Creates a PayPal payment order
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const response = await fetch(`${apiUrl}/payments/paypal/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Backend create-payment error:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('✅ Backend create-payment success:', data)
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    console.error('❌ Create-payment route error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
