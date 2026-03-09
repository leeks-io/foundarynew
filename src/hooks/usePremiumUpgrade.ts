"use client"
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'

const TREASURY = new PublicKey("FpMGXWfCgQz3j9isPEEKNBrewyrdJ8siufymqFcYfL9")
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") // Mainnet USDC
const USDC_AMOUNT = 5_000_000 // 5 USDC (6 decimals)

export function usePremiumUpgrade() {
    const wallet = useWallet()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [status, setStatus] = useState<"idle" | "sending" | "verifying" | "done" | "error">("idle")

    const upgrade = async () => {
        if (!wallet.publicKey || !wallet.signTransaction || !user) return
        setStatus("sending")

        try {
            const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com")

            // Get USDC token accounts
            const fromATA = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey)
            const toATA = await getAssociatedTokenAddress(USDC_MINT, TREASURY)

            // Build transfer transaction
            const tx = new Transaction().add(
                createTransferInstruction(fromATA, toATA, wallet.publicKey, USDC_AMOUNT)
            )
            tx.feePayer = wallet.publicKey
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

            // Sign and send
            const signed = await wallet.signTransaction(tx)
            const signature = await connection.sendRawTransaction(signed.serialize())
            await connection.confirmTransaction(signature)

            setStatus("verifying")

            // Verify on backend + activate premium
            const res = await fetch("/api/payments/premium/verify", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transaction_hash: signature })
            })

            if (!res.ok) throw new Error("Verification failed")

            // Invalidate user cache
            queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
            setStatus("done")
        } catch (e) {
            console.error(e)
            setStatus("error")
        }
    }

    return { upgrade, status }
}
