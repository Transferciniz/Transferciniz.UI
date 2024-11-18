export function useCamera(): Promise<string>{
    return new Promise((resolve, reject) => {
        usePushReactNative("onOpenCamera", "")
        //@ts-ignore
        window.onImageCaptured = (message: string) => {
            alert(message);
            resolve(message)
        }

        window.addEventListener("onQrReaded", (event) => {

        })
        window.addEventListener("onCameraCancelled", (event) => {

        })
    })
}