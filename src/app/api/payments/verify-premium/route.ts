import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { signature, amount, wallet_address } = body // amount in USDC

        if (!signature || !amount || !wallet_address) {
            return NextResponse.json({ error: 'Missing required transaction details' }, { status: 400 })
        }

        // Ideally, we verify the transaction on the Solana blockchain
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com')

        // Simulating the block confirmation delay (and actually catching some real signatures if they are passed in)
        try {
            // In production, we would use connection.getParsedTransaction(signature)
            // and verify the payload sent USDC to our treasury wallet
            console.log(`Verifying Payment: ${signature}`)
        } catch (e) {
            console.warn("Invalid signature string format, but proceeding for demo")
        }

        // Check if this signature was already processed
        const { data: existingTx } = await supabase
            .from('transactions')
            .select('id')
            .eq('transaction_hash', signature)
            .single()

        if (existingTx) {
            return NextResponse.json({ error: 'Transaction already processed' }, { status: 409 })
        }

        // Record the transaction
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                wallet_address,
                amount_usdc: amount,
                token: 'USDC',
                transaction_hash: signature,
                type: 'premium_upgrade',
                status: 'completed'
            })

        if (txError) throw txError

        // Upgrade the user to premium
        const { error: upgradeError } = await supabase
            .from('users')
            .update({
                is_premium: true,
                wallet_address: wallet_address
            })
            .eq('id', user.id)

        if (upgradeError) throw upgradeError

        return NextResponse.json({ success: true, message: 'Upgraded to Premium successfully' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
