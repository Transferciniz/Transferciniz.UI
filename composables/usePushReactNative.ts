export function usePushReactNative(eventName: string, payload: any): void{
    //@ts-ignore
    if(window.webkit){
        //@ts-ignore
        window.webkit.messageHandlers.messageHandler.postMessage(JSON.stringify({
            type: eventName,
            payload: payload
        }));
    }



}