import fsPromises from "fs/promises";
import fs from "fs";

async function safeDelete(fileName: string): Promise<void> {
    try {
        if (!fileName) return;
        if (fs.existsSync(fileName)) {
            await fsPromises.unlink(fileName);
        }
    }
    catch (err: any) {
        console.log(err.message);
    }
}

export default safeDelete;