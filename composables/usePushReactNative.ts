export function usePushReactNative(eventName: string, payload: any): void{
    //@ts-ignore
    if (window.ReactNativeWebView) {
        //@ts-ignore
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: eventName,
            payload: payload
        }));
    }

}