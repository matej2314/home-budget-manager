import AppGallery from "./internal/AppGallery"

export default function GallerySection() {

    return (
        <div id="gallery-of-the-project" className="w-full h-fit flex flex-col justify-center items-center border-b-2 border-slate-500/25">
            <h2 className="text-2xl w-full h-fit flex justify-center">Gallery of the project screenshots</h2>
            <div className="w-full h-fit flex justify-center items-center">
                <AppGallery />
            </div>

        </div>
    )
}