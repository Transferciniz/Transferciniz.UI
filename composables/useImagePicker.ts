export function useImagePicker(): Promise<string>{
    return new Promise((resolve, reject) => {
        //@ts-ignore
        window.onImageCaptured = (message: string) => {
            resolve(message)
        }

        usePushReactNative("onImagePicker", "")
    })
}