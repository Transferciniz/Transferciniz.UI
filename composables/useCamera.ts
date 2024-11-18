export function useCamera(): Promise<string>{
    return new Promise((resolve, reject) => {
        usePushReactNative("onOpenCamera", "")
        window.addEventListener("onImageCaptured", (event: Event) => {
            alert(event);
            resolve("")
        })
        window.addEventListener("onQrReaded", (event) => {

        })
        window.addEventListener("onCameraCancelled", (event) => {

        })
    })
}