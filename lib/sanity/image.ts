import createImageUrlBuilder from "@sanity/image-url"
import { dataset, projectId } from "../../sanity/env"

const builder = createImageUrlBuilder({
    projectId,
    dataset,
})

export const urlFor = (source: any) => {
    return builder.image(source)
}
