export const mapPhotos = (photos, isMobile, isTablet, isDesktop, serverUrl) => {
    return photos.filter(photo => {
        if (isMobile || isTablet) {
            return photo.includes('-640.webp');
        }
        if (isDesktop) {
            return !photo.includes('-320.webp') && !photo.includes('-640.webp')
        }
        return false;
    })
        .map(photo => {
            const baseName = photo.replace(/-\d+\.webp$/, '').replace('.webp', '');
            return {
                src: `${serverUrl}/screens/${baseName}.webp`,
                srcSet: `
                ${serverUrl}/screens/${baseName}-320.webp 320w,
                ${serverUrl}/screens/${baseName}-640.webp 640w,
                ${serverUrl}/screens/${baseName}.webp 960w
                `,
            };
        });
};