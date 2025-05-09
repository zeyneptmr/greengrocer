// helpers/imageHelper.js
export const getImageFromPath = (path, images) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith("data:image")) return path;
    if (path.startsWith("http://localhost:8080/")) return path;

    const filename = path.split('/').pop();
    const imageKey = Object.keys(images).find(key => key.includes(filename));
    if (imageKey) return images[imageKey];

    return `http://localhost:8080/${filename}`;
};
