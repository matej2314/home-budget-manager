export const mapPhotos = (photos, isMobile, isTablet, isDesktop, serverUrl) => {
    if (!Array.isArray(photos)) {
        return [];
    }

    return photos
        .filter(photo => {
            if (isMobile) {
                return photo.includes('-320.webp');
            }
            if (isTablet) {
                return photo.includes('-640.webp');
            }
            if (isDesktop) {
                return photo.includes('-960.webp');
            }
            return false;
        })
        .map(photo => {
            const baseName = photo.replace(/-\d+\.webp$/, '').replace('.webp', '');

            return {
                src: `${serverUrl}/screens/${baseName}-960.webp`,
                srcSet: `${serverUrl}/screens/${baseName}-320.webp 320w,
                 ${serverUrl}/screens/${baseName}-640.webp 640w,
                  ${serverUrl}/screens/${baseName}-960.webp 960w
                `,
            };
        });
};
