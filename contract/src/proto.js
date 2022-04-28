import { Tx, TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import { toUtf8 } from "@cosmjs/encoding";

const body = TxBody.fromPartial({
    messages: [
        {
            typeUrl:"/cosmos.bank.v1beta1.MsgSend",
            value: {
                "amount": [{"amount":"1000","denom":"stake"}],
                "from_address":"cosmos15ccshhmp0gsx29qpqq6g4zmltnnvgmyu9ueuadh9y2nc5zj0szls5gtddz",
                "to_address":"cosmos10h9stc5v6ntgeygf5xf945njqq5h32r53uquvw"
            }
        }
    ],
    memo: ""
})

const tx = Tx.fromPartial({
    body: body
})

const buf = Tx.encode(tx).finish()

console.log(buf)