import { NFTokenMint, NFTokenAcceptOffer, convertStringToHex, NFTokenMintFlags, NFTokenCreateOffer} from 'xrpl'
import { TxnOptions } from "../models"
import { getClient } from "../xrpl-client"
import { submitAndWait } from 'xrpl/dist/npm/sugar'

const client = getClient()

type MintNftProps = Omit<NFTokenMint, "TransactionType" | "Account" | "Flags">

export const mintNft = async(
    {URI, NFTokenTaxon = 0,  ...rest}: MintNftProps,
    { wallet }: TxnOptions
) => {
    // prepare
    const nftMintTxn: NFTokenMint = {
        ...rest,
        Flags: NFTokenMintFlags.tfTransferable,
        NFTokenTaxon,
        URI: convertStringToHex(URI ?? ""),
        Account: wallet.address,
        TransactionType: "NFTokenMint",
    }

    const prepared = await client.autofill(nftMintTxn)

    // sign
    const signed = wallet.sign(prepared)

    // submit and wait
    const response = await client.submitAndWait(signed.tx_blob)
    console.log(response)

    return response
}

type createNftOferProps = Omit<NFTokenCreateOffer, "TransactionType" | "Account">

export const createNftOfer = async (props: createNftOferProps, { wallet }: TxnOptions) => {
    // prepare
    const offerTxn: NFTokenCreateOffer = {
        ...props,
        Account: wallet.address,
        TransactionType: "NFTokenCreateOffer",
    }

    // Joining autofill, sign and submit wait
    const result = await client.submitAndWait(offerTxn, {
        autofill: true,
        wallet: wallet,
    })

    console.log(result)
    return result
}

type AcceptNftOfferProps = Omit<NFTokenAcceptOffer, "TransactionType" | "Account">

export const acceptNftOffer = async (props: AcceptNftOfferProps, { wallet }: TxnOptions) => {
    // Prepare
    const acceptTxn: NFTokenAcceptOffer = {
        ...props,
        TransactionType: "NFTokenAcceptOffer",
        Account: wallet.address,
    }

    // Autofill, Sign and submit wait
    const result = await client.submitAndWait(acceptTxn, {
        autofill: true,
        wallet: wallet,
    })
    console.log(result)
    return result
}
