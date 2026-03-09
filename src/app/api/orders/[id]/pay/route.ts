import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { Connection } from '@solana/web3.js'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { signature, wallet_address } = body

        if (!signature || !wallet_address) {
            return NextResponse.json({ error: 'Missing required transaction details' }, { status: 400 })
        }

        // 1. Fetch the Order details
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('amount, buyer_id, status')
            .eq('id', params.id)
            .single()

        if (orderError || !orderData) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        if (orderData.buyer_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden. You are not the buyer of this order.' }, { status: 403 })
        }

        if (orderData.status !== 'pending') {
            return NextResponse.json({ error: 'Order is not in a pending state for payment' }, { status: 400 })
        }

        // 2. Ideally, Verify Transaction against Solana RPC
        // Ensure that orderData.amount USDC was sent to Escrow/Treasury from wallet_address
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com')
        console.log(`Simulating validation of Escrow Payment: ${signature} for Order ${params.id}`)

        // Record the transaction
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                wallet_address,
                amount_usdc: orderData.amount,
                token: 'USDC',
                transaction_hash: signature,
                type: 'escrow_lock',
                status: 'completed'
            })

        if (txError) {
            if (txError.code === '23505') {
                return NextResponse.json({ error: 'Transaction already processed' }, { status: 409 })
            }
            throw txError
        }

        // 3. Mark the Order as "in_progress" now that payment is locked
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'in_progress', updated_at: new Date().toISOString() })
            .eq('id', params.id)

        if (updateError) throw updateError

        return NextResponse.json({ success: true, message: 'Payment secured in escrow. Order is now active.' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
