export const getImageFromPath = (path, images) => {
    if (!path) return '/placeholder.png';

    if (path.startsWith("data:image")) return path;
    if (path.startsWith("http://localhost:8080/") || path.startsWith("https://")) return path;

    try {
        const filename = path.split('/').pop()?.toLowerCase();

        // 1️⃣ Önce assets içindeki görselleri dene
        const imageKey = Object.keys(images).find(key =>
            key.toLowerCase().startsWith(filename.split('.')[0]) // örn: bread.jpg, bread.abc123.jpg
        );
        if (imageKey) return images[imageKey];

        // 2️⃣ Eğer assets’te yoksa backend yolunu döndür
        return `http://localhost:8080/assets/${filename}`;
    } catch (error) {
        console.error("Image error:", error, "Path:", path);
        return '/placeholder.png';
    }
};
