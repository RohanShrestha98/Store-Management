import { ConvertHtmlToPlainText } from "./convertHtmlToPlainText"

export default function truncateText(text, textLength = 40) {
    const planeDescription = ConvertHtmlToPlainText(text)

    return (
        <>
            {text === "" ? "-"
                : <div>
                    {planeDescription?.slice(0, textLength)} {text?.length > textLength && "..."}
                </div>}
        </>

    )
}
