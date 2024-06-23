// todo: write the client
import { Client } from "xrpl"

const network = {
    RIPPLE_TESTNET: "wss://s.altnet.rippletest.net:51233/",
}

let client: Client

export const getClient = () => {
    // If first time running the application
    if(!client) {
        // Instantiate new Client
        client = new Client(network.RIPPLE_TESTNET)
    }
    // Otherwise return existing object 
    return client
}