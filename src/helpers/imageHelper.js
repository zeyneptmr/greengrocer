export const getImageFromPath = (path, images) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith("data:image")) return path;
    if (path.startsWith("http://localhost:8080/")) return path;

    try {
        const filename = path.split('/').pop();
        const imageKey = Object.keys(images).find(key =>
            key.toLowerCase().includes(filename.toLowerCase()) ||
            filename.toLowerCase().includes(key.toLowerCase().split('.')[0])
        );

        if (imageKey) return images[imageKey];

        const formattedPath = path.startsWith('/') ? path : `/${path}`;
        return `http://localhost:8080${formattedPath}`;
    } catch (error) {
        console.error("Error processing image path:", error, "Path was:", path);
        return '/placeholder.png';
    }
};
