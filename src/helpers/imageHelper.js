export const getImageFromPath = (path, images) => {
    if (!path) return '/placeholder.png';

    if (path.startsWith("data:image")) return path;
    if (path.startsWith("http://localhost:8080/") || path.startsWith("https://")) return path;

    try {
        const filename = path.split('/').pop()?.toLowerCase();

        const imageKey = Object.keys(images).find(key =>
            key.toLowerCase().startsWith(filename.split('.')[0]) 
        );
        if (imageKey) return images[imageKey];


        return `http://localhost:8080/assets/${filename}`;
    } catch (error) {
        console.error("Image error:", error, "Path:", path);
        return '/placeholder.png';
    }
};