import { Tx, TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import { encodeBase64, decodeBase64 } from '@endo/base64';

var JsonToArray = function(json)
{
	var str = JSON.stringify(json, null, 0);
	var ret = new Uint8Array(str.length);
	for (var i = 0; i < str.length; i++) {
		ret[i] = str.charCodeAt(i);
	}
	return ret
};

const body = TxBody.fromPartial({
    messages: [
        {
            typeUrl:"/cosmos.bank.v1beta1.MsgSend",
            value: JsonToArray({
                "amount": [{"amount":"1000","denom":"stake"}],
                "from_address":"cosmos15ccshhmp0gsx29qpqq6g4zmltnnvgmyu9ueuadh9y2nc5zj0szls5gtddz",
                "to_address":"cosmos10h9stc5v6ntgeygf5xf945njqq5h32r53uquvw"
            })
        }
    ]
})

const tx = Tx.fromPartial({
    body: body
})

const buf = Tx.encode(tx).finish()

const encodeVal = encodeBase64(new Uint8Array(buf))

console.log(Buffer.from(decodeBase64(encodeVal), "base64").toString("ascii"))

console.log(Buffer.from(JSON.stringify({
    messages: [
        {
            typeUrl:"/cosmos.bank.v1beta1.MsgSend",
            value: JsonToArray({
                "amount": [{"amount":"1000","denom":"stake"}],
                "from_address":"cosmos15ccshhmp0gsx29qpqq6g4zmltnnvgmyu9ueuadh9y2nc5zj0szls5gtddz",
                "to_address":"cosmos10h9stc5v6ntgeygf5xf945njqq5h32r53uquvw"
            })
        }
    ]
})).toString("utf-8"))