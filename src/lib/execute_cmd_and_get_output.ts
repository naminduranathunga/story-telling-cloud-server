

export async function execute_cmd_and_get_output(cmd:string) {
    return new Promise<string>((resolve, reject) => {
        const { exec } = require("child_process");
        exec(cmd, (error:any, stdout:any, stderr:any) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve(stdout);
        });
    });
}