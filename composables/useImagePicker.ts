export function useImagePicker(): Promise<File>{
    return new Promise((resolve, reject) => {
        //@ts-ignore
        window.onImageCaptured = (message: string) => {
            resolve(useBase64ToFile(message, 'image.jpg'))
        }

        usePushReactNative("onImagePicker", "")
    })
}