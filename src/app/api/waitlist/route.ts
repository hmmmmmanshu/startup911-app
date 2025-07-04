import { NextRequest, NextResponse } from 'next/server'
import { addToWaitlist } from '../../../../lib/supabase/queries'

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Add to waitlist
    const result = await addToWaitlist(email, source || 'grant_snap_extension')

    return NextResponse.json(
      { 
        message: 'Successfully added to waitlist!',
        data: result
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Waitlist API error:', error)
    
    // Handle known errors
    if (error instanceof Error) {
      if (error.message === 'This email is already on the waitlist') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to add email to waitlist. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Waitlist API is working' },
    { status: 200 }
  )
} 