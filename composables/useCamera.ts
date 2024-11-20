export function useCamera(method: 'capture' | 'qr'): Promise<string>{
    return new Promise((resolve, reject) => {
        if(method === 'capture') {
            usePushReactNative("onOpenCamera", "")
        }
        if(method === 'qr'){
            usePushReactNative("onOpenQrReader", "")
        }
        //@ts-ignore
        window.onImageCaptured = (message: string) => {
            resolve(message)
        }

        //@ts-ignore
        window.onQrReaded = (payload: string) => {
            resolve(payload);
        }

        //@ts-ignore
        window.onCancelled = () => {
            reject()
        }

    })
}