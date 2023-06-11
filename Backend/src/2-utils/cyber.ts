import crypto from "crypto";

const salt = "%sEcUreOnLINE$hop!@";

function hash(plainText: string) {
    if(!plainText) return null;
    return crypto.createHmac("sha512", salt).update(plainText).digest("hex");
}

export default hash;