export function useImagePicker(): Promise<Blob>{
    return new Promise((resolve, reject) => {
        usePushReactNative("onImagePicker", "")
        
        //@ts-ignore
        window.onImageCaptured = (message: string) => {
            resolve(base64ToJpg(message))
        }

        function base64ToJpg(base64String: string) {
            // Base64 kısmındaki ön eki ayırıyoruz
            const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, "");
            
            // Base64'ü bir Uint8Array'e çeviriyoruz
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
        
            // Uint8Array'i bir Blob'a çeviriyoruz
            return  new Blob([byteArray], { type: "image/jpeg" });
    
        }

    })
}