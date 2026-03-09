import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Fetch Order and Verify it's ready for release
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('amount, buyer_id, status, service_id')
            .eq('id', id)
            .single()

        if (orderError || !orderData) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Only the Buyer can release funds
        if (orderData.buyer_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden. Only the buyer can release escrow funds.' }, { status: 403 })
        }

        if (orderData.status !== 'in_progress' && orderData.status !== 'completed') {
            return NextResponse.json({ error: 'Order must be in progress or completed to release funds.' }, { status: 400 })
        }

        // 2. Fetch the Freelancer's Wallet Address
        const { data: serviceData } = await supabase
            .from('services')
            .select('freelancer_id')
            .eq('id', orderData.service_id)
            .single()

        const { data: freelancerData } = await supabase
            .from('users')
            .select('wallet_address')
            .eq('id', serviceData?.freelancer_id)
            .single()

        if (!freelancerData?.wallet_address) {
            return NextResponse.json({ error: 'Freelancer has not configured a payout wallet address.' }, { status: 400 })
        }

        // 3. Initiate programmatic transfer of Escrow USDC to Freelancer
        // In a real Web3 environment, the backend server signs a transaction using the Escrow Treasury private key here
        // sending orderData.amount to freelancerData.wallet_address.
        console.log(`Releasing ${orderData.amount} USDC from Treasury to ${freelancerData.wallet_address}`)

        const simulationSignature = `escrow_release_${id}_${Date.now()}`

        // 4. Record the payout transaction
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: serviceData!.freelancer_id,
                wallet_address: freelancerData.wallet_address,
                amount_usdc: orderData.amount,
                token: 'USDC',
                transaction_hash: simulationSignature,
                type: 'escrow_release',
                status: 'completed'
            })

        if (txError) throw txError

        // 5. Mark the Order as successfully completed if it wasn't already
        await supabase
            .from('orders')
            .update({ status: 'completed', updated_at: new Date().toISOString() })
            .eq('id', id)

        return NextResponse.json({ success: true, message: 'Funds released to freelancer.', signature: simulationSignature }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
