export function useBase64ToFile(base64: string, fileName: string): File {
    const byteString = atob(base64.split(",")[1]); // Base64 string'in veri kısmını ayır
    const mimeType = base64.match(/data:(.*?);base64/)?.[1] || "application/octet-stream"; // MIME tipi bul
    const byteNumbers = new Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
}