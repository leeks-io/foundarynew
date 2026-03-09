import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

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
        const { requirements } = body // text from buyer 

        // Fetch service price
        const { data: serviceData, error: serviceError } = await supabase
            .from('services')
            .select('price')
            .eq('id', params.id)
            .single()

        if (serviceError || !serviceData) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 })
        }

        // We simulate a Web3 transaction initiation creating the order here
        // In real web3, client verifies smart contract payment before status="in_progress"
        const { data, error } = await supabase
            .from('orders')
            .insert({
                service_id: params.id,
                buyer_id: user.id,
                amount: serviceData.price,
                status: 'pending', // Waiting for blockchain payment verifiation
                requirements
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ order: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
