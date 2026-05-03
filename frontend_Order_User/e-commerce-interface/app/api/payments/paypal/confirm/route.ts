import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * GET /api/payments/paypal/confirm?paypalOrderId=xxx
 * Proxy to backend: GET /api/payments/paypal/confirm?paypalOrderId=xxx
 * Captures PayPal payment
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const paypalOrderId = searchParams.get('paypalOrderId')

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: 'paypalOrderId is required' },
        { status: 400 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const response = await fetch(`${apiUrl}/payments/paypal/confirm?paypalOrderId=${paypalOrderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Backend confirm error:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('✅ Backend confirm success:', data)
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    console.error('❌ Confirm route error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
