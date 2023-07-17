// Convert a file to base64 string
export const convertToBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => resolve(fileReader.result);
		fileReader.onerror = (error) => reject(error);
	})
};

export const strippedToHTML = (content: string) => {
	return content.replace(/<[^>]+>/g, '') as string;
}